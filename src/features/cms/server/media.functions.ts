import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, count, desc, eq, isNull, isNotNull, sql, not, like } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsAuditLogs, cmsMedia } from "@/db/schema";
import { roleHasPermission } from "@/features/auth/domain/permissions";

import { listSearchSchema } from "../domain/list-search";
import { mediaDeliveryBaseUrl, mediaUrl } from "../domain/media";
import { emptyMediaUsage, type MediaUsage } from "../domain/media-associations";
import { requireSession, requireCmsPermission } from "./cms-auth";
import { CmsError, notFound } from "./cms-errors";
import { auditInsert, type CmsDb } from "./cms.repository";
import { listOrder, listTextFilter, listPage } from "./list-query";
import { MEDIA_USAGE_SQL } from "./media-usage";

export const listMediaFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireCmsPermission("cmsMedia", "list");
  const database = getDb(env);
  const [items, associations] = await Promise.all([
    database
      .select()
      .from(cmsMedia)
      .where(isNull(cmsMedia.deletedAt))
      .orderBy(desc(cmsMedia.createdAt)),
    loadMediaUsage(database),
  ]);
  const usageByMedia = associations;
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
    const usage = (await loadMediaUsage(database)).get(data.id);
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

    const usage = (await loadMediaUsage(database)).get(media.id) ?? emptyMediaUsage();
    if (usage.total !== data.confirmedUsage) {
      throw new CmsError(
        409,
        "MEDIA_USAGE_CHANGED",
        "Le associazioni del media sono cambiate. Controlla di nuovo prima di eliminarlo.",
      );
    }

    if (usage.total)
      throw new CmsError(
        409,
        "MEDIA_IN_USE",
        "Il media è ancora utilizzato. Rimuovi prima le associazioni.",
      );
    await database.batch([
      database
        .update(cmsMedia)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(and(eq(cmsMedia.id, media.id), isNull(cmsMedia.deletedAt))),
      database
        .insert(cmsAuditLogs)
        .values(auditInsert(session.user.id, "media.trashed", "media", media.id)),
    ]);
    return { ok: true, usage };
  });

export const listTrashedMediaFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireSession();
  if (!roleHasPermission(session.user.role, "cmsMedia", "delete")) return [];
  return getDb(env)
    .select()
    .from(cmsMedia)
    .where(isNotNull(cmsMedia.deletedAt))
    .orderBy(desc(cmsMedia.deletedAt));
});
export const restoreMediaFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const session = await requireCmsPermission("cmsMedia", "delete");
    const database = getDb(env);
    const media = await database.query.cmsMedia.findFirst({ where: eq(cmsMedia.id, data.id) });
    if (!media || !(await env.CMS_MEDIA.head(media.storageKey)))
      throw new CmsError(409, "MEDIA_UNAVAILABLE", "Il file originale non è disponibile su R2");
    await database.batch([
      database
        .update(cmsMedia)
        .set({ deletedAt: null, updatedAt: new Date() })
        .where(eq(cmsMedia.id, data.id)),
      database
        .insert(cmsAuditLogs)
        .values(auditInsert(session.user.id, "media.restored", "media", data.id)),
    ]);
    return { ok: true };
  });

async function loadMediaUsage(database: CmsDb) {
  const rows = await database.all<{
    mediaId: string;
    articleCovers: number;
    articleContent: number;
    categoryHeroes: number;
    revisions: number;
  }>(sql.raw(MEDIA_USAGE_SQL));
  return new Map<string, MediaUsage>(
    rows.map((row) => [
      row.mediaId,
      {
        ...row,
        total: row.articleCovers + row.articleContent + row.categoryHeroes + row.revisions,
      },
    ]),
  );
}

export const listMediaPageFn = createServerFn({ method: "GET" })
  .validator(listSearchSchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsMedia", data.scope === "trash" ? "delete" : "list");
    const database = getDb(env);
    const mimeFilter =
      data.kind === "file"
        ? and(
            not(like(cmsMedia.mimeType, "image/%")),
            not(like(cmsMedia.mimeType, "video/%")),
            not(like(cmsMedia.mimeType, "audio/%")),
          )
        : data.kind && ["image", "video", "audio"].includes(data.kind)
          ? like(cmsMedia.mimeType, `${data.kind}/%`)
          : undefined;
    const where = and(
      data.scope === "trash" ? isNotNull(cmsMedia.deletedAt) : isNull(cmsMedia.deletedAt),
      mimeFilter,
      listTextFilter(data.query, cmsMedia.name, cmsMedia.filename),
    );
    const [totalRow] = await database.select({ value: count() }).from(cmsMedia).where(where);
    const total = totalRow?.value ?? 0;
    const page = listPage(data.page, data.pageSize, total);
    const items = await database
      .select()
      .from(cmsMedia)
      .where(where)
      .orderBy(
        listOrder(
          {
            name: sql`coalesce(${cmsMedia.name},${cmsMedia.filename})`,
            createdAt: cmsMedia.createdAt,
            mimeType: cmsMedia.mimeType,
            sizeBytes: cmsMedia.sizeBytes,
          },
          data.sortBy,
          data.direction,
          cmsMedia.createdAt,
        ),
        asc(cmsMedia.id),
      )
      .limit(data.pageSize)
      .offset((page - 1) * data.pageSize);
    const baseUrl = mediaDeliveryBaseUrl(import.meta.env.MODE, env.MEDIA_PUBLIC_URL);
    return {
      items: items.map((item) => ({ ...item, url: mediaUrl(baseUrl, item.storageKey) })),
      total,
      page,
      pageSize: data.pageSize,
    };
  });
