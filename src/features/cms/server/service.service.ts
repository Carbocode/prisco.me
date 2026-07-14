import { env } from "cloudflare:workers";
import { and, eq, inArray, isNull } from "drizzle-orm";

import { getDb } from "@/db";
import {
  cmsAuditLogs,
  cmsMedia,
  cmsRedirects,
  cmsServiceRevisions,
  cmsServices,
} from "@/db/schema";

import { parseCmsDocument, serializeCmsDocument } from "../domain/cms-document";
import { mediaUrl } from "../domain/media";
import { createServiceSchema, updateServiceSchema } from "../domain/validation";
import { requireCmsPermission } from "./cms-auth";
import { CmsError, notFound } from "./cms-errors";
import { auditInsert, serviceRepository } from "./cms.repository";

export async function listAdminServices() {
  await requireCmsPermission("cmsService", "list");
  return serviceRepository(getDb(env)).listAdmin();
}
export async function getAdminService(id: string) {
  await requireCmsPermission("cmsService", "read");
  const item = await serviceRepository(getDb(env)).byId(id);
  if (!item) throw notFound("service");
  return item;
}
export async function createService(input: unknown) {
  const session = await requireCmsPermission("cmsService", "create");
  const data = createServiceSchema.parse(input);
  const database = getDb(env);
  const id = crypto.randomUUID();
  const now = new Date();
  try {
    await database.batch([
      database.insert(cmsServices).values({
        id,
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        content: serializeCmsDocument(data.content),
        imageMediaId: data.imageMediaId,
        icon: data.icon,
        priceLabel: data.priceLabel,
        callToActionLabel: data.callToActionLabel,
        callToActionUrl: data.callToActionUrl,
        sortOrder: data.sortOrder,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        canonicalUrl: data.canonicalUrl,
        noIndex: data.noIndex,
        createdById: session.user.id,
        lastEditedById: session.user.id,
        createdAt: now,
        updatedAt: now,
      }),
      database
        .insert(cmsAuditLogs)
        .values(auditInsert(session.user.id, "service.created", "service", id)),
    ]);
  } catch (error) {
    if (String(error).includes("UNIQUE"))
      throw new CmsError(409, "SLUG_CONFLICT", "Slug already in use");
    throw error;
  }
  return getAdminService(id);
}
export async function updateService(input: unknown) {
  const session = await requireCmsPermission("cmsService", "update");
  const data = updateServiceSchema.parse(input);
  const database = getDb(env);
  const current = await serviceRepository(database).byId(data.id);
  if (!current) throw notFound("service");
  const revision = (await serviceRepository(database).nextRevision(current.id))[0]?.value ?? 1;
  const values = {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
    ...(data.content !== undefined && { content: serializeCmsDocument(data.content) }),
    ...(data.imageMediaId !== undefined && { imageMediaId: data.imageMediaId }),
    ...(data.icon !== undefined && { icon: data.icon }),
    ...(data.priceLabel !== undefined && { priceLabel: data.priceLabel }),
    ...(data.callToActionLabel !== undefined && { callToActionLabel: data.callToActionLabel }),
    ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    ...(data.callToActionUrl !== undefined && { callToActionUrl: data.callToActionUrl }),
    ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
    ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
    ...(data.canonicalUrl !== undefined && { canonicalUrl: data.canonicalUrl }),
    ...(data.noIndex !== undefined && { noIndex: data.noIndex }),
    lastEditedById: session.user.id,
    updatedAt: new Date(),
    version: current.version + 1,
  };
  const changedSlug = data.slug && data.slug !== current.slug && current.status === "published";
  const statements = [
    database.insert(cmsServiceRevisions).values({
      serviceId: current.id,
      revision,
      snapshot: JSON.stringify(current),
      createdById: session.user.id,
    }),
    database
      .update(cmsServices)
      .set(values)
      .where(
        and(
          eq(cmsServices.id, current.id),
          eq(cmsServices.version, data.version),
          isNull(cmsServices.deletedAt),
        ),
      ),
    ...(changedSlug
      ? [
          database.insert(cmsRedirects).values({
            sourcePath: `/servizi/${current.slug}`,
            destinationPath: `/servizi/${data.slug}`,
            entityType: "service",
            entityId: current.id,
          }),
        ]
      : []),
    database
      .insert(cmsAuditLogs)
      .values(
        auditInsert(
          session.user.id,
          changedSlug ? "service.slug_changed" : "service.updated",
          "service",
          current.id,
        ),
      ),
  ];
  try {
    await database.batch(statements as [(typeof statements)[0], ...typeof statements]); // oxlint-disable-line typescript/no-unsafe-type-assertion
  } catch (error) {
    if (String(error).includes("UNIQUE"))
      throw new CmsError(409, "SLUG_CONFLICT", "Slug already in use");
    throw error;
  }
  const updated = await serviceRepository(database).byId(current.id);
  if (!updated || updated.version === current.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  return updated;
}
export async function publishService(input: { id: string; version: number }) {
  const session = await requireCmsPermission("cmsService", "publish");
  const database = getDb(env);
  const result = await database
    .update(cmsServices)
    .set({
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
      lastEditedById: session.user.id,
      version: input.version + 1,
    })
    .where(
      and(
        eq(cmsServices.id, input.id),
        eq(cmsServices.version, input.version),
        isNull(cmsServices.deletedAt),
      ),
    )
    .returning({ id: cmsServices.id });
  if (!result.length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  await database
    .insert(cmsAuditLogs)
    .values(auditInsert(session.user.id, "service.published", "service", input.id));
  return getAdminService(input.id);
}
export async function unpublishService(input: { id: string; version: number }) {
  return changeServiceStatus(input, "draft", "service.unpublished");
}
export async function archiveService(input: { id: string; version: number }) {
  return changeServiceStatus(input, "archived", "service.archived");
}
export async function restoreService(input: { id: string; version: number }) {
  const session = await requireCmsPermission("cmsService", "restore");
  const database = getDb(env);
  const result = await database
    .update(cmsServices)
    .set({
      status: "draft",
      publishedAt: null,
      deletedAt: null,
      updatedAt: new Date(),
      lastEditedById: session.user.id,
      version: input.version + 1,
    })
    .where(and(eq(cmsServices.id, input.id), eq(cmsServices.version, input.version)))
    .returning({ id: cmsServices.id });
  if (!result.length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  await database
    .insert(cmsAuditLogs)
    .values(auditInsert(session.user.id, "service.restored", "service", input.id));
  return getAdminService(input.id);
}
export async function listServiceRevisions(serviceId: string) {
  await requireCmsPermission("cmsService", "read");
  const item = await serviceRepository(getDb(env)).byId(serviceId);
  if (!item) throw notFound("service");
  return serviceRepository(getDb(env)).revisions(serviceId);
}
export async function restoreServiceRevision(input: {
  serviceId: string;
  revisionId: string;
  version: number;
}) {
  const session = await requireCmsPermission("cmsService", "restore");
  const database = getDb(env);
  const current = await serviceRepository(database).byId(input.serviceId);
  if (!current) throw notFound("service");
  const revision = await database.query.cmsServiceRevisions.findFirst({
    where: and(
      eq(cmsServiceRevisions.id, input.revisionId),
      eq(cmsServiceRevisions.serviceId, input.serviceId),
    ),
  });
  if (!revision) throw notFound("revision");
  const snapshot = JSON.parse(revision.snapshot) as typeof current; // oxlint-disable-line typescript/no-unsafe-type-assertion
  const nextRevision = (await serviceRepository(database).nextRevision(current.id))[0]?.value ?? 1;
  const results = await database.batch([
    database.insert(cmsServiceRevisions).values({
      serviceId: current.id,
      revision: nextRevision,
      snapshot: JSON.stringify(current),
      createdById: session.user.id,
    }),
    database
      .update(cmsServices)
      .set({
        name: snapshot.name,
        slug: snapshot.slug,
        shortDescription: snapshot.shortDescription,
        content: snapshot.content,
        contentVersion: snapshot.contentVersion,
        imageMediaId: snapshot.imageMediaId,
        icon: snapshot.icon,
        priceLabel: snapshot.priceLabel,
        callToActionLabel: snapshot.callToActionLabel,
        callToActionUrl: snapshot.callToActionUrl,
        sortOrder: snapshot.sortOrder,
        seoTitle: snapshot.seoTitle,
        seoDescription: snapshot.seoDescription,
        canonicalUrl: snapshot.canonicalUrl,
        noIndex: snapshot.noIndex,
        status: "draft",
        publishedAt: null,
        version: current.version + 1,
        updatedAt: new Date(),
        lastEditedById: session.user.id,
      })
      .where(and(eq(cmsServices.id, current.id), eq(cmsServices.version, input.version))),
    database.insert(cmsAuditLogs).values(
      auditInsert(session.user.id, "revision.restored", "service", current.id, {
        revision: revision.revision,
      }),
    ),
  ]);
  if (!(results[1] as { meta?: { changes?: number } }).meta?.changes)
    // oxlint-disable-line typescript/no-unsafe-type-assertion
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  return serviceRepository(database).byId(current.id);
}

async function changeServiceStatus(
  input: { id: string; version: number },
  status: "draft" | "archived",
  action: string,
) {
  const permission = status === "archived" ? "delete" : "publish";
  const session = await requireCmsPermission("cmsService", permission);
  const database = getDb(env);
  const result = await database
    .update(cmsServices)
    .set({
      status,
      publishedAt: null,
      updatedAt: new Date(),
      lastEditedById: session.user.id,
      version: input.version + 1,
    })
    .where(
      and(
        eq(cmsServices.id, input.id),
        eq(cmsServices.version, input.version),
        isNull(cmsServices.deletedAt),
      ),
    )
    .returning({ id: cmsServices.id });
  if (!result.length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  await database
    .insert(cmsAuditLogs)
    .values(auditInsert(session.user.id, action, "service", input.id));
  return getAdminService(input.id);
}
export async function listPublishedServices() {
  return hydratePublicServices(await serviceRepository(getDb(env)).listPublic());
}
export async function getPublishedServiceBySlug(slug: string) {
  const item = (await serviceRepository(getDb(env)).publicBySlug(slug))[0];
  return item ? ((await hydratePublicServices([item]))[0] ?? null) : null;
}

async function hydratePublicServices<T extends { content: string; imageMediaId: string | null }>(
  items: T[],
) {
  const ids = new Set<string>();
  for (const item of items) {
    if (item.imageMediaId) ids.add(item.imageMediaId);
    collectMediaIds(parseCmsDocument(item.content).content, ids);
  }
  const rows = ids.size
    ? await getDb(env)
        .select()
        .from(cmsMedia)
        .where(and(inArray(cmsMedia.id, [...ids]), isNull(cmsMedia.deletedAt)))
    : [];
  const media = rows.map((item) => ({
    id: item.id,
    url: mediaUrl(env.MEDIA_PUBLIC_URL, item.storageKey),
    altText: item.altText,
    caption: item.caption,
  }));
  return items.map((item) => ({
    ...item,
    media,
    image: item.imageMediaId
      ? (media.find((entry) => entry.id === item.imageMediaId) ?? null)
      : null,
  }));
}

function collectMediaIds(nodes: Array<Record<string, unknown>> | undefined, ids: Set<string>) {
  for (const node of nodes ?? []) {
    if (node.type === "mediaImage" && node.attrs && typeof node.attrs === "object") {
      const mediaId = (node.attrs as Record<string, unknown>).mediaId; // oxlint-disable-line typescript/no-unsafe-type-assertion
      if (typeof mediaId === "string") ids.add(mediaId);
    }
    if (Array.isArray(node.content))
      collectMediaIds(node.content as Array<Record<string, unknown>>, ids); // oxlint-disable-line typescript/no-unsafe-type-assertion
  }
}
