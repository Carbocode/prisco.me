import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsMedia } from "@/db/schema";

import { mediaUrl } from "../domain/media";
import { requireCmsPermission } from "./cms-auth";
export const listMediaFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireCmsPermission("cmsMedia", "list");
  const items = await getDb(env)
    .select()
    .from(cmsMedia)
    .where(isNull(cmsMedia.deletedAt))
    .orderBy(desc(cmsMedia.createdAt))
    .limit(100);
  return items.map((item) => ({ ...item, url: mediaUrl(env.MEDIA_PUBLIC_URL, item.storageKey) }));
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
    await requireCmsPermission("cmsMedia", "update");
    const [item] = await getDb(env)
      .update(cmsMedia)
      .set({ altText: data.altText, caption: data.caption, updatedAt: new Date() })
      .where(and(eq(cmsMedia.id, data.id), isNull(cmsMedia.deletedAt)))
      .returning();
    return item;
  });
import { and } from "drizzle-orm";
export const archiveMediaFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsMedia", "delete");
    await getDb(env)
      .update(cmsMedia)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(cmsMedia.id, data.id));
    return { ok: true };
  });
