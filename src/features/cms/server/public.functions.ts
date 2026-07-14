import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsCategories, cmsRedirects } from "@/db/schema";

import { getPublishedArticleBySlug, listPublishedArticles } from "./article.service";
import { getPublishedServiceBySlug, listPublishedServices } from "./service.service";
export const listPublishedArticlesFn = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().min(1).max(50).default(20) }))
  .handler(({ data }) => listPublishedArticles(data.limit));
export const getPublishedArticleFn = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(180) }))
  .handler(({ data }) => getPublishedArticleBySlug(data.slug));
export const listPublishedServicesFn = createServerFn({ method: "GET" }).handler(() =>
  listPublishedServices(),
);
export const getPublishedServiceFn = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(180) }))
  .handler(({ data }) => getPublishedServiceBySlug(data.slug));
export const getCmsRedirectFn = createServerFn({ method: "GET" })
  .validator(z.object({ path: z.string().startsWith("/") }))
  .handler(async ({ data }) =>
    getDb(env).query.cmsRedirects.findFirst({ where: eq(cmsRedirects.sourcePath, data.path) }),
  );
export const listPublicCategoriesFn = createServerFn({ method: "GET" }).handler(() =>
  getDb(env)
    .select({
      name: cmsCategories.name,
      slug: cmsCategories.slug,
      description: cmsCategories.description,
    })
    .from(cmsCategories)
    .where(isNull(cmsCategories.deletedAt)),
);
