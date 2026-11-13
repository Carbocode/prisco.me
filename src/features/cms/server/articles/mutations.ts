import { inArray } from "drizzle-orm";

import { cmsArticleTags, cmsCategories, experienceProjects } from "@/db/schema";
import { estimateReadingTimeMinutes } from "@/features/cms/domain/reading-time";
import { createArticleSchema, updateArticleSchema } from "@/features/cms/domain/validation";
import { publicationState } from "@/features/cms/domain/workflow";
import { assertArticleRelations } from "@/features/cms/server/article-relations";
import { db } from "@/features/cms/server/articles/connection";
import { publicArchiveSlug } from "@/features/cms/server/articles/publication";
import { getAdminArticle } from "@/features/cms/server/articles/queries";
import { requireArticleAccess, requireCmsPermission } from "@/features/cms/server/cms-auth";
import { CmsError, notFound } from "@/features/cms/server/cms-errors";
import {
  and,
  articleRepository,
  auditInsert,
  cmsArticleCategories,
  cmsArticleRevisions,
  cmsArticles,
  cmsAuditLogs,
  cmsRedirects,
  eq,
  isNull,
} from "@/features/cms/server/cms.repository";
import { CURRENT_CONTENT_VERSION, serializeCmsDocument } from "@/features/content/domain/document";

export async function createArticle(input: unknown) {
  const session = await requireCmsPermission("cmsArticle", "create");
  const data = createArticleSchema.parse(input);
  await assertArticleRelations(db(), { ...data, content: serializeCmsDocument(data.content) });
  const id = crypto.randomUUID();
  const now = new Date();
  try {
    await db().batch([
      db()
        .insert(cmsArticles)
        .values({
          id,
          title: data.title,
          publishedAt: data.publishedAt,
          slug: data.slug,
          excerpt: data.excerpt,
          content: serializeCmsDocument(data.content),
          contentVersion: CURRENT_CONTENT_VERSION,
          readingTimeMinutes: estimateReadingTimeMinutes(data.content),
          coverMediaId: data.coverMediaId,
          authorId: session.user.id,
          organizationId: data.organizationId,
          projectRole: data.projectRole,
          projectPeriod: data.projectPeriod,
          projectFeatured: data.projectFeatured,
          projectSortOrder: data.projectSortOrder,
          lastEditedById: session.user.id,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          noIndex: data.noIndex,
          canonicalUrl: data.canonicalUrl,
          createdAt: now,
          updatedAt: now,
        }),
      ...data.categoryIds.map((categoryId) =>
        db().insert(cmsArticleCategories).values({ articleId: id, categoryId }),
      ),
      ...data.experienceIds.map((experienceId, sortOrder) =>
        db().insert(experienceProjects).values({ articleId: id, experienceId, sortOrder }),
      ),
      ...data.tagIds.map((tagId, sortOrder) =>
        db().insert(cmsArticleTags).values({ articleId: id, tagId, sortOrder }),
      ),
      db()
        .insert(cmsAuditLogs)
        .values(auditInsert(session.user.id, "article.created", "article", id)),
    ]);
  } catch (error) {
    if (
      String(error).includes("CONTENT_VERSION_CONFLICT") ||
      String(error).includes("cms_article_revisions")
    )
      throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
    if (String(error).includes("UNIQUE"))
      throw new CmsError(409, "SLUG_CONFLICT", "Slug already in use");
    throw error;
  }
  return getAdminArticle(id);
}

export async function updateArticle(input: unknown) {
  const session = await requireCmsPermission("cmsArticle", "update");
  const data = updateArticleSchema.parse(input);
  const database = db();
  const current = await articleRepository(database).byId(data.id);
  if (!current) throw notFound("article");
  requireArticleAccess(session.user, current, "update");
  if (session.user.role === "author" && current.status !== "draft")
    throw new CmsError(
      403,
      "FORBIDDEN",
      "Solo un editor può modificare contenuti già pubblicati o archiviati",
    );
  if (current.version !== data.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  const associations = await getAdminArticle(current.id);
  await assertArticleRelations(database, {
    ...associations,
    ...data,
    content: data.content ? serializeCmsDocument(data.content) : current.content,
  });
  const revision = (await articleRepository(database).nextRevision(current.id))[0]?.value ?? 1;
  const now = new Date();
  if (data.publishedAt !== undefined && !["admin", "editor"].includes(session.user.role ?? ""))
    throw new CmsError(403, "FORBIDDEN", "Permission denied");
  const values = {
    ...(data.publishedAt !== undefined
      ? ["published", "scheduled"].includes(current.status)
        ? publicationState(data.publishedAt ?? undefined)
        : { publishedAt: data.publishedAt }
      : {}),
    ...(data.title !== undefined && { title: data.title }),
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
    ...(data.content !== undefined && {
      content: serializeCmsDocument(data.content),
      contentVersion: CURRENT_CONTENT_VERSION,
      readingTimeMinutes: estimateReadingTimeMinutes(data.content),
    }),
    ...(data.coverMediaId !== undefined && { coverMediaId: data.coverMediaId }),
    ...(data.organizationId !== undefined && { organizationId: data.organizationId }),
    ...(data.projectRole !== undefined && { projectRole: data.projectRole }),
    ...(data.projectPeriod !== undefined && { projectPeriod: data.projectPeriod }),
    ...(data.projectFeatured !== undefined && { projectFeatured: data.projectFeatured }),
    ...(data.projectSortOrder !== undefined && { projectSortOrder: data.projectSortOrder }),
    ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
    ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
    ...(data.canonicalUrl !== undefined && { canonicalUrl: data.canonicalUrl }),
    ...(data.noIndex !== undefined && { noIndex: data.noIndex }),
    lastEditedById: session.user.id,
    updatedAt: now,
    version: data.version + 1,
  };
  const changedPath =
    ((data.slug && data.slug !== current.slug) ||
      (data.categoryIds !== undefined && data.categoryIds[0] !== associations.categoryIds[0])) &&
    ["published", "scheduled"].includes(current.status);
  const sourceCategories = changedPath
    ? await database
        .select({ slug: cmsCategories.slug })
        .from(cmsArticleCategories)
        .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
        .where(eq(cmsArticleCategories.articleId, current.id))
    : [];
  const destinationCategories =
    changedPath && data.categoryIds
      ? await database
          .select({ slug: cmsCategories.slug })
          .from(cmsCategories)
          .where(inArray(cmsCategories.id, data.categoryIds))
      : sourceCategories;
  const redirectPaths = changedPath
    ? {
        source: `/${publicArchiveSlug(sourceCategories[0]?.slug)}/${current.slug}`,
        destination: `/${publicArchiveSlug(destinationCategories[0]?.slug)}/${data.slug ?? current.slug}`,
      }
    : null;
  const mutation = database
    .update(cmsArticles)
    .set(values)
    .where(
      and(
        eq(cmsArticles.id, current.id),
        eq(cmsArticles.version, data.version),
        isNull(cmsArticles.deletedAt),
      ),
    )
    .returning();
  let updated: typeof current | undefined;
  const statements = [
    database.insert(cmsArticleRevisions).values({
      articleId: current.id,
      revision,
      snapshot: JSON.stringify({ ...(await getAdminArticle(current.id)), ...current }),
      createdById: session.user.id,
    }),
    mutation,
    ...(data.categoryIds
      ? [
          database
            .delete(cmsArticleCategories)
            .where(eq(cmsArticleCategories.articleId, current.id)),
          ...data.categoryIds.map((categoryId) =>
            database.insert(cmsArticleCategories).values({ articleId: current.id, categoryId }),
          ),
        ]
      : []),
    ...(data.experienceIds
      ? [
          database.delete(experienceProjects).where(eq(experienceProjects.articleId, current.id)),
          ...data.experienceIds.map((experienceId, sortOrder) =>
            database
              .insert(experienceProjects)
              .values({ articleId: current.id, experienceId, sortOrder }),
          ),
        ]
      : []),
    ...(data.tagIds
      ? [
          database.delete(cmsArticleTags).where(eq(cmsArticleTags.articleId, current.id)),
          ...data.tagIds.map((tagId, sortOrder) =>
            database.insert(cmsArticleTags).values({ articleId: current.id, tagId, sortOrder }),
          ),
        ]
      : []),
    ...(redirectPaths && redirectPaths.source !== redirectPaths.destination
      ? [
          database
            .delete(cmsRedirects)
            .where(eq(cmsRedirects.sourcePath, redirectPaths.destination)),
          database
            .update(cmsRedirects)
            .set({ destinationPath: redirectPaths.destination })
            .where(
              and(eq(cmsRedirects.entityId, current.id), eq(cmsRedirects.entityType, "article")),
            ),
          database
            .insert(cmsRedirects)
            .values({
              sourcePath: redirectPaths.source,
              destinationPath: redirectPaths.destination,
              entityType: "article",
              entityId: current.id,
            })
            .onConflictDoUpdate({
              target: cmsRedirects.sourcePath,
              set: { destinationPath: redirectPaths.destination },
            }),
        ]
      : []),
    database
      .insert(cmsAuditLogs)
      .values(
        auditInsert(
          session.user.id,
          changedPath ? "article.slug_changed" : "article.updated",
          "article",
          current.id,
          { fromStatus: current.status },
        ),
      ),
  ];
  try {
    const results = await database.batch([statements[0], mutation, ...statements.slice(2)]);
    updated = results[1][0];
  } catch (error) {
    if (
      String(error).includes("CONTENT_VERSION_CONFLICT") ||
      String(error).includes("cms_article_revisions")
    )
      throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
    if (String(error).includes("UNIQUE"))
      throw new CmsError(409, "SLUG_CONFLICT", "Slug already in use");
    throw error;
  }
  if (!updated || updated.version === current.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  return updated;
}
