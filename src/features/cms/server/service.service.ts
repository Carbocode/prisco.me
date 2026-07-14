import { env } from "cloudflare:workers";
import { and, eq, isNull } from "drizzle-orm";

import { getDb } from "@/db";
import { cmsAuditLogs, cmsServiceRevisions, cmsServices } from "@/db/schema";

import { serializeCmsDocument } from "../domain/cms-document";
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
    ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    ...(data.callToActionUrl !== undefined && { callToActionUrl: data.callToActionUrl }),
    ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
    ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
    lastEditedById: session.user.id,
    updatedAt: new Date(),
    version: current.version + 1,
  };
  await database.batch([
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
    database
      .insert(cmsAuditLogs)
      .values(auditInsert(session.user.id, "service.updated", "service", current.id)),
  ]);
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
  return getAdminService(input.id);
}
export async function listPublishedServices() {
  return serviceRepository(getDb(env)).listPublic();
}
export async function getPublishedServiceBySlug(slug: string) {
  return (await serviceRepository(getDb(env)).publicBySlug(slug))[0] ?? null;
}
