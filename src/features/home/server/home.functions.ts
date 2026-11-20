import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, eq, inArray, isNull } from "drizzle-orm";

import { getDb } from "@/db";
import {
  cmsArticles,
  cmsArticleTags,
  cmsHomeFeatured,
  cmsMedia,
  cmsOrganizations,
  cmsTags,
} from "@/db/schema";
import { mediaDeliveryBaseUrl, mediaUrl } from "@/features/cms/domain/media";
import { homeFeaturedEligibility } from "@/features/cms/server/home-featured.repository";

import type { HomeArticle, HomeProject } from "../home.types";

export const getHomeFeaturedFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb(env);
  const rows = await db
    .select({
      category: cmsHomeFeatured.category,
      id: cmsArticles.id,
      title: cmsArticles.title,
      slug: cmsArticles.slug,
      excerpt: cmsArticles.excerpt,
      role: cmsArticles.projectRole,
      company: cmsOrganizations.name,
      coverKey: cmsMedia.storageKey,
      coverAlt: cmsMedia.altText,
      coverMime: cmsMedia.mimeType,
    })
    .from(cmsHomeFeatured)
    .innerJoin(cmsArticles, eq(cmsHomeFeatured.articleId, cmsArticles.id))
    .leftJoin(cmsMedia, and(eq(cmsArticles.coverMediaId, cmsMedia.id), isNull(cmsMedia.deletedAt)))
    .leftJoin(
      cmsOrganizations,
      and(eq(cmsArticles.organizationId, cmsOrganizations.id), isNull(cmsOrganizations.deletedAt)),
    )
    .where(homeFeaturedEligibility(db, cmsHomeFeatured.category))
    .orderBy(cmsHomeFeatured.position);

  const projectRows = rows.filter((row) => row.category === "progetti");
  const tags = projectRows.length
    ? await db
        .select({ articleId: cmsArticleTags.articleId, id: cmsTags.id, name: cmsTags.name })
        .from(cmsArticleTags)
        .innerJoin(cmsTags, eq(cmsArticleTags.tagId, cmsTags.id))
        .where(
          and(
            inArray(
              cmsArticleTags.articleId,
              projectRows.map((row) => row.id),
            ),
            isNull(cmsTags.deletedAt),
          ),
        )
        .orderBy(cmsArticleTags.sortOrder, cmsTags.name)
    : [];

  const baseUrl = mediaDeliveryBaseUrl(import.meta.env.MODE, env.MEDIA_PUBLIC_URL);
  const articles: HomeArticle[] = rows
    .filter((row) => row.category === "blog")
    .map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      cover: row.coverKey ? { url: mediaUrl(baseUrl, row.coverKey), altText: row.coverAlt } : null,
    }));
  const projects: HomeProject[] = projectRows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.excerpt ?? row.title,
    role: row.role ?? "Software Engineer",
    company: row.company ?? "Progetto personale",
    image:
      row.coverKey && row.coverMime === "image/webp" ? mediaUrl(baseUrl, row.coverKey) : undefined,
    skills: tags.filter((tag) => tag.articleId === row.id).map(({ id, name }) => ({ id, name })),
  }));
  return { articles, projects };
});
