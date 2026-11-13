import { asc, sql } from "drizzle-orm";

import { cmsArticleTags, cmsTags, experienceProjects, experiences } from "@/db/schema";
import { publicationDateParts } from "@/features/cms/domain/publication-date";
import { listArticlesSchema } from "@/features/cms/domain/validation";
import { db } from "@/features/cms/server/articles/connection";
import { hydratePublicArticles } from "@/features/cms/server/articles/hydration";
import { requireCmsPermission } from "@/features/cms/server/cms-auth";
import { CmsError, notFound } from "@/features/cms/server/cms-errors";
import {
  and,
  articleRepository,
  cmsArticleCategories,
  cmsArticles,
  eq,
  isNull,
} from "@/features/cms/server/cms.repository";

export async function listAdminArticles(input: unknown) {
  const session = await requireCmsPermission("cmsArticle", "list");
  const parsed = listArticlesSchema.parse(input);
  if (session.user.role === "author") parsed.authorId = session.user.id;
  return articleRepository(db()).listAdmin(parsed);
}

export async function getAdminArticle(id: string) {
  const session = await requireCmsPermission("cmsArticle", "read");
  const item = await articleRepository(db()).byId(id);
  if (!item) throw notFound("article");
  if (session.user.role === "author" && item.authorId !== session.user.id)
    throw new CmsError(403, "FORBIDDEN", "Permission denied");
  const categories = await db()
    .select({ categoryId: cmsArticleCategories.categoryId })
    .from(cmsArticleCategories)
    .where(eq(cmsArticleCategories.articleId, id));
  const tags = await db()
    .select({ tagId: cmsArticleTags.tagId })
    .from(cmsArticleTags)
    .innerJoin(cmsTags, eq(cmsArticleTags.tagId, cmsTags.id))
    .where(and(eq(cmsArticleTags.articleId, id), isNull(cmsTags.deletedAt)))
    .orderBy(asc(cmsArticleTags.sortOrder), asc(cmsTags.name));
  const links = await db()
    .select({ id: experienceProjects.experienceId })
    .from(experienceProjects)
    .where(eq(experienceProjects.articleId, id));
  return {
    ...item,
    experienceIds: links.map((link) => link.id),
    categoryIds: categories.map((category) => category.categoryId),
    tagIds: tags.map((tag) => tag.tagId),
  };
}

export async function listPublishedArticles(limit?: number, categorySlug?: string) {
  const safeLimit = Math.min(limit ?? 20, 50);
  const repository = articleRepository(db());
  const items = categorySlug
    ? await repository.listPublicByCategory(categorySlug, safeLimit)
    : await repository.listPublic(safeLimit);
  return hydratePublicArticles(items);
}

export async function listPublishedArticlesPage(limit = 20, cursor?: string) {
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const rows = await articleRepository(db()).listPublic(
    safeLimit + 1,
    cursor ? decodeCursor(cursor) : undefined,
  );
  const hasMore = rows.length > safeLimit;
  const items = await hydratePublicArticles(rows.slice(0, safeLimit));
  const last = items.at(-1);
  return {
    items,
    nextCursor: hasMore && last?.publishedAt ? encodeCursor(last.publishedAt, last.id) : null,
  };
}

export async function getPublishedArticleBySlug(slug: string) {
  const item = (await articleRepository(db()).publicBySlug(slug))[0];
  if (!item) return null;
  return (await hydratePublicArticles([item]))[0] ?? null;
}

export async function getPreviewArticle(id: string) {
  const article = await getAdminArticle(id);
  return (await hydratePublicArticles([article]))[0] ?? null;
}

export type PublicArticleFilter = {
  year?: number;
  month?: number;
  day?: number;
  categorySlug?: string;
  authorSlug?: string;
  tagSlug?: string;
};

export async function listPublishedArticlesByFilter(filter: PublicArticleFilter) {
  const items = await hydratePublicArticles(await articleRepository(db()).listPublicArchive());
  return items.filter((item) => {
    const date = item.publishedAt ? new Date(item.publishedAt) : null;
    if (!date) return false;
    const parts = publicationDateParts(date);
    if (filter.year !== undefined && parts.year !== filter.year) return false;
    if (filter.month !== undefined && parts.month !== filter.month) return false;
    if (filter.day !== undefined && parts.day !== filter.day) return false;
    if (
      filter.categorySlug &&
      !item.categories.some((category) => category.slug === filter.categorySlug)
    )
      return false;
    if (filter.tagSlug && !item.tags.some((tag) => tag.slug === filter.tagSlug)) return false;
    return !filter.authorSlug || item.author.slug === filter.authorSlug;
  });
}

function encodeCursor(publishedAt: Date, id: string) {
  return btoa(`${publishedAt.getTime()}:${id}`);
}

function decodeCursor(cursor: string) {
  try {
    const [timestamp, id] = atob(cursor).split(":");
    const value = Number(timestamp);
    if (!Number.isFinite(value) || !id) throw new Error("invalid cursor");
    return { publishedAt: new Date(value), id };
  } catch {
    throw new CmsError(400, "INVALID_CURSOR", "Invalid pagination cursor");
  }
}

export async function getArticleStats() {
  const session = await requireCmsPermission("cmsArticle", "list");
  const effectiveStatus = sql<string>`case when ${cmsArticles.status} = 'scheduled' and ${cmsArticles.publishedAt} <= ${Date.now()} then 'published' else ${cmsArticles.status} end`;
  return db()
    .select({ status: effectiveStatus, count: sql<number>`count(*)` })
    .from(cmsArticles)
    .where(
      and(
        isNull(cmsArticles.deletedAt),
        session.user.role === "author" ? eq(cmsArticles.authorId, session.user.id) : undefined,
      ),
    )
    .groupBy(effectiveStatus);
}

export async function listArticleExperiences() {
  await requireCmsPermission("cmsArticle", "read");
  return db()
    .select({ id: experiences.id, title: experiences.title, org: experiences.org })
    .from(experiences)
    .orderBy(asc(experiences.sortOrder));
}
