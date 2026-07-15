import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsAuditLogs, cmsMedia } from "@/db/schema";

import { mediaDeliveryBaseUrl, mediaUrl } from "../domain/media";
import { requireCmsPermission } from "./cms-auth";
import { auditInsert } from "./cms.repository";
export const listMediaFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireCmsPermission("cmsMedia", "list");
  const items = await getDb(env)
    .select()
    .from(cmsMedia)
    .where(isNull(cmsMedia.deletedAt))
    .orderBy(desc(cmsMedia.createdAt))
    .limit(100);
  const baseUrl = mediaDeliveryBaseUrl(env.VITE_MODE, env.MEDIA_PUBLIC_URL);
  return items.map((item) => ({ ...item, url: mediaUrl(baseUrl, item.storageKey) }));
});
export const updateMediaFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().uuid(),
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
        .set({ altText: data.altText, caption: data.caption, updatedAt: new Date() })
        .where(and(eq(cmsMedia.id, data.id), isNull(cmsMedia.deletedAt)))
        .returning(),
      database
        .insert(cmsAuditLogs)
        .values(auditInsert(session.user.id, "media.updated", "media", data.id)),
    ]);
    const item = results[0][0];
    return item;
  });
import { and } from "drizzle-orm";
export const archiveMediaFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const session = await requireCmsPermission("cmsMedia", "delete");
    const database = getDb(env);
    await database.batch([
      database
        .update(cmsMedia)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(cmsMedia.id, data.id)),
      database
        .insert(cmsAuditLogs)
        .values(auditInsert(session.user.id, "media.archived", "media", data.id)),
    ]);
    return { ok: true };
  });
