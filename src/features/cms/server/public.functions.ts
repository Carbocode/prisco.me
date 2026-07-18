import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsCategories, cmsMedia, cmsRedirects } from "@/db/schema";

import { mediaDeliveryBaseUrl, mediaUrl } from "../domain/media";
import { getPublishedArticleBySlug, listPublishedArticles } from "./article.service";
export const listPublishedArticlesFn = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().min(1).max(50).default(20) }))
  .handler(({ data }) => listPublishedArticles(data.limit));
export const getPublishedArticleFn = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(180) }))
  .handler(({ data }) => getPublishedArticleBySlug(data.slug));
export const getCmsRedirectFn = createServerFn({ method: "GET" })
  .validator(z.object({ path: z.string().startsWith("/") }))
  .handler(async ({ data }) =>
    getDb(env).query.cmsRedirects.findFirst({ where: eq(cmsRedirects.sourcePath, data.path) }),
  );
export const listPublicCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  const categories = await getDb(env)
    .select({
      name: cmsCategories.name,
      slug: cmsCategories.slug,
      description: cmsCategories.description,
      schemaType: cmsCategories.schemaType,
      archiveSort: cmsCategories.archiveSort,
      archiveEyebrow: cmsCategories.archiveEyebrow,
      heroStorageKey: cmsMedia.storageKey,
      heroAltText: cmsMedia.altText,
    })
    .from(cmsCategories)
    .leftJoin(cmsMedia, and(eq(cmsCategories.heroMediaId, cmsMedia.id), isNull(cmsMedia.deletedAt)))
    .where(isNull(cmsCategories.deletedAt));
  const baseUrl = mediaDeliveryBaseUrl(import.meta.env.MODE, env.MEDIA_PUBLIC_URL);
  return categories.map(({ heroStorageKey, heroAltText, ...category }) => ({
    ...category,
    hero: heroStorageKey
      ? {
          url: mediaUrl(baseUrl, heroStorageKey),
          altText: heroAltText,
        }
      : null,
  }));
});
