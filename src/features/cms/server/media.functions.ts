import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import {
  cmsArticleRevisions,
  cmsArticles,
  cmsAuditLogs,
  cmsCategories,
  cmsMedia,
} from "@/db/schema";

import { parseCmsDocument, serializeCmsDocument } from "../domain/cms-document";
import { mediaDeliveryBaseUrl, mediaUrl } from "../domain/media";
import {
  countMediaInDocument,
  emptyMediaUsage,
  mediaIdsInDocument,
  removeMediaFromDocument,
  type MediaUsage,
} from "../domain/media-associations";
import { requireCmsPermission } from "./cms-auth";
import { CmsError, notFound } from "./cms-errors";
import { auditInsert, type CmsDb } from "./cms.repository";

export const listMediaFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireCmsPermission("cmsMedia", "list");
  const database = getDb(env);
  const [items, associations] = await Promise.all([
    database
      .select()
      .from(cmsMedia)
      .where(isNull(cmsMedia.deletedAt))
      .orderBy(desc(cmsMedia.createdAt)),
    loadMediaAssociations(database),
  ]);
  const usageByMedia = mediaUsageMap(associations);
  const baseUrl = mediaDeliveryBaseUrl(import.meta.env.MODE, env.MEDIA_PUBLIC_URL);
  return items.map((item) => ({
    ...item,
    url: mediaUrl(baseUrl, item.storageKey),
    usage: usageByMedia.get(item.id) ?? emptyMediaUsage(),
  }));
});

export const getMediaUsageFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsMedia", "list");
    const database = getDb(env);
    const media = await database.query.cmsMedia.findFirst({
      where: and(eq(cmsMedia.id, data.id), isNull(cmsMedia.deletedAt)),
    });
    if (!media) throw notFound("media");
    const usage = mediaUsageMap(await loadMediaAssociations(database)).get(data.id);
    return usage ?? emptyMediaUsage();
  });

export const updateMediaFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().uuid(),
      name: z.string().trim().min(1).max(120),
      altText: z.string().trim().max(300).nullable(),
      caption: z.string().trim().max(500).nullable(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await requireCmsPermission("cmsMedia", "update");
    const database = getDb(env);
    const results = await database.batch([
      database
        .update(cmsMedia)
        .set({
          name: data.name,
          altText: data.altText,
          caption: data.caption,
          updatedAt: new Date(),
        })
        .where(and(eq(cmsMedia.id, data.id), isNull(cmsMedia.deletedAt)))
        .returning(),
      database
        .insert(cmsAuditLogs)
        .values(auditInsert(session.user.id, "media.updated", "media", data.id)),
    ]);
    return results[0][0];
  });

export const deleteMediaFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().uuid(),
      confirmedUsage: z.number().int().nonnegative(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await requireCmsPermission("cmsMedia", "delete");
    const database = getDb(env);
    const media = await database.query.cmsMedia.findFirst({
      where: and(eq(cmsMedia.id, data.id), isNull(cmsMedia.deletedAt)),
    });
    if (!media) throw notFound("media");

    const associations = await loadMediaAssociations(database);
    const usage = mediaUsageMap(associations).get(media.id) ?? emptyMediaUsage();
    if (usage.total !== data.confirmedUsage) {
      throw new CmsError(
        409,
        "MEDIA_USAGE_CHANGED",
        "Le associazioni del media sono cambiate. Controlla di nuovo prima di eliminarlo.",
      );
    }

    const now = new Date();
    const statements = [];
    for (const article of associations.articles) {
      const document = parseCmsDocument(article.content);
      const contentUsage = countMediaInDocument(document, media.id);
      if (!contentUsage && article.coverMediaId !== media.id) continue;
      statements.push(
        database
          .update(cmsArticles)
          .set({
            ...(contentUsage
              ? { content: serializeCmsDocument(removeMediaFromDocument(document, media.id)) }
              : {}),
            ...(article.coverMediaId === media.id ? { coverMediaId: null } : {}),
            lastEditedById: session.user.id,
            updatedAt: now,
            version: article.version + 1,
          })
          .where(eq(cmsArticles.id, article.id)),
      );
    }
    for (const category of associations.categories) {
      if (category.heroMediaId !== media.id) continue;
      statements.push(
        database
          .update(cmsCategories)
          .set({ heroMediaId: null, updatedAt: now })
          .where(eq(cmsCategories.id, category.id)),
      );
    }
    for (const revision of associations.revisions) {
      const snapshot = sanitizeRevisionSnapshot(revision.snapshot, media.id);
      if (!snapshot) continue;
      statements.push(
        database
          .update(cmsArticleRevisions)
          .set({ snapshot })
          .where(eq(cmsArticleRevisions.id, revision.id)),
      );
    }
    statements.push(
      database
        .update(cmsMedia)
        .set({ deletedAt: now, updatedAt: now })
        .where(and(eq(cmsMedia.id, media.id), isNull(cmsMedia.deletedAt))),
      database.insert(cmsAuditLogs).values(
        auditInsert(session.user.id, "media.deleted", "media", media.id, {
          storageKey: media.storageKey,
          usage,
        }),
      ),
    );
    await database.batch(
      statements as [(typeof statements)[number], ...(typeof statements)[number][]], // oxlint-disable-line typescript/no-unsafe-type-assertion
    );

    try {
      await env.CMS_MEDIA.delete(media.storageKey);
    } catch (error) {
      await database.batch([
        database
          .update(cmsMedia)
          .set({ deletedAt: null, updatedAt: new Date() })
          .where(eq(cmsMedia.id, media.id)),
        database.insert(cmsAuditLogs).values(
          auditInsert(session.user.id, "media.storage_delete_failed", "media", media.id, {
            storageKey: media.storageKey,
          }),
        ),
      ]);
      throw error;
    }

    return { ok: true, usage };
  });

type MediaAssociations = Awaited<ReturnType<typeof loadMediaAssociations>>;

async function loadMediaAssociations(database: CmsDb) {
  const [articles, categories, revisions] = await Promise.all([
    database
      .select({
        id: cmsArticles.id,
        content: cmsArticles.content,
        coverMediaId: cmsArticles.coverMediaId,
        version: cmsArticles.version,
      })
      .from(cmsArticles),
    database
      .select({ id: cmsCategories.id, heroMediaId: cmsCategories.heroMediaId })
      .from(cmsCategories),
    database
      .select({ id: cmsArticleRevisions.id, snapshot: cmsArticleRevisions.snapshot })
      .from(cmsArticleRevisions),
  ]);
  return { articles, categories, revisions };
}

function mediaUsageMap(associations: MediaAssociations) {
  const usage = new Map<string, MediaUsage>();
  const entry = (mediaId: string) => {
    const current = usage.get(mediaId) ?? emptyMediaUsage();
    usage.set(mediaId, current);
    return current;
  };
  for (const article of associations.articles) {
    if (article.coverMediaId) entry(article.coverMediaId).articleCovers += 1;
    const document = parseCmsDocument(article.content);
    for (const mediaId of mediaIdsInDocument(document)) {
      entry(mediaId).articleContent += countMediaInDocument(document, mediaId);
    }
  }
  for (const category of associations.categories) {
    if (category.heroMediaId) entry(category.heroMediaId).categoryHeroes += 1;
  }
  for (const current of usage.values()) {
    current.total = current.articleCovers + current.articleContent + current.categoryHeroes;
  }
  return usage;
}

function sanitizeRevisionSnapshot(snapshotValue: string, mediaId: string) {
  const parsed: unknown = JSON.parse(snapshotValue);
  if (!parsed || typeof parsed !== "object") return null;
  const snapshot = parsed as Record<string, unknown>; // oxlint-disable-line typescript/no-unsafe-type-assertion
  let changed = false;
  if (snapshot.coverMediaId === mediaId) {
    snapshot.coverMediaId = null;
    changed = true;
  }
  if (typeof snapshot.content === "string") {
    const document = parseCmsDocument(snapshot.content);
    if (countMediaInDocument(document, mediaId)) {
      snapshot.content = serializeCmsDocument(removeMediaFromDocument(document, mediaId));
      changed = true;
    }
  }
  return changed ? JSON.stringify(snapshot) : null;
}
