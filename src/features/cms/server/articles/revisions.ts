import { cmsArticleTags, experienceProjects } from "@/db/schema";
import { estimateReadingTimeMinutes } from "@/features/cms/domain/reading-time";
import { revisionSnapshotSchema } from "@/features/cms/domain/validation";
import { assertArticleRelations } from "@/features/cms/server/article-relations";
import { db } from "@/features/cms/server/articles/connection";
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
  eq,
} from "@/features/cms/server/cms.repository";
import { parseCmsDocument } from "@/features/content/domain/document";

export async function listArticleRevisions(articleId: string) {
  const session = await requireCmsPermission("cmsArticle", "read");
  const current = await articleRepository(db()).byId(articleId);
  if (!current) throw notFound("article");
  if (session.user.role === "author" && current.authorId !== session.user.id)
    throw new CmsError(403, "FORBIDDEN", "Permission denied");
  return articleRepository(db()).revisions(articleId);
}

export async function restoreArticleRevision(input: {
  articleId: string;
  revisionId: string;
  version: number;
}) {
  const session = await requireCmsPermission("cmsArticle", "restore");
  const database = db();
  const current = await articleRepository(database).byId(input.articleId);
  if (!current) throw notFound("article");
  requireArticleAccess(session.user, current, "restore");
  if (current.version !== input.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  const revision = await database.query.cmsArticleRevisions.findFirst({
    where: and(
      eq(cmsArticleRevisions.id, input.revisionId),
      eq(cmsArticleRevisions.articleId, input.articleId),
    ),
  });
  if (!revision) throw notFound("revision");
  const parsedSnapshot: unknown = JSON.parse(revision.snapshot);
  if (!parsedSnapshot || typeof parsedSnapshot !== "object")
    throw new CmsError(422, "INVALID_REVISION", "Invalid revision snapshot");
  const snapshot = revisionSnapshotSchema.parse(parsedSnapshot);
  const associations = await getAdminArticle(current.id);
  await assertArticleRelations(database, {
    ...snapshot,
    categoryIds: snapshot.categoryIds ?? associations.categoryIds,
    tagIds: snapshot.tagIds ?? associations.tagIds,
  });
  const nextRevision = (await articleRepository(database).nextRevision(current.id))[0]?.value ?? 1;
  const result = await database.batch([
    database.insert(cmsArticleRevisions).values({
      articleId: current.id,
      revision: nextRevision,
      snapshot: JSON.stringify({ ...(await getAdminArticle(current.id)), ...current }),
      createdById: session.user.id,
    }),
    database
      .update(cmsArticles)
      .set({
        title: snapshot.title,
        slug: snapshot.slug,
        excerpt: snapshot.excerpt,
        content: snapshot.content,
        contentVersion: snapshot.contentVersion,
        readingTimeMinutes: estimateReadingTimeMinutes(parseCmsDocument(snapshot.content)),
        coverMediaId: snapshot.coverMediaId,
        organizationId: snapshot.organizationId,
        projectRole: snapshot.projectRole,
        projectPeriod: snapshot.projectPeriod,
        projectFeatured: snapshot.projectFeatured,
        projectSortOrder: snapshot.projectSortOrder,
        seoTitle: snapshot.seoTitle,
        seoDescription: snapshot.seoDescription,
        canonicalUrl: snapshot.canonicalUrl,
        noIndex: snapshot.noIndex,
        status: "draft",
        publishedAt: null,
        version: input.version + 1,
        updatedAt: new Date(),
        lastEditedById: session.user.id,
      })
      .where(and(eq(cmsArticles.id, current.id), eq(cmsArticles.version, input.version))),
    ...(snapshot.categoryIds
      ? [
          database
            .delete(cmsArticleCategories)
            .where(eq(cmsArticleCategories.articleId, current.id)),
          ...snapshot.categoryIds.map((categoryId) =>
            database.insert(cmsArticleCategories).values({ articleId: current.id, categoryId }),
          ),
        ]
      : []),
    ...(snapshot.experienceIds
      ? [
          database.delete(experienceProjects).where(eq(experienceProjects.articleId, current.id)),
          ...snapshot.experienceIds.map((experienceId, sortOrder) =>
            database
              .insert(experienceProjects)
              .values({ articleId: current.id, experienceId, sortOrder }),
          ),
        ]
      : []),
    ...(snapshot.tagIds
      ? [
          database.delete(cmsArticleTags).where(eq(cmsArticleTags.articleId, current.id)),
          ...snapshot.tagIds.map((tagId, sortOrder) =>
            database.insert(cmsArticleTags).values({ articleId: current.id, tagId, sortOrder }),
          ),
        ]
      : []),
    database.insert(cmsAuditLogs).values(
      auditInsert(session.user.id, "revision.restored", "article", current.id, {
        revision: revision.revision,
      }),
    ),
  ]);
  if (!(result[1] as { meta?: { changes?: number } }).meta?.changes)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  return articleRepository(database).byId(current.id);
}
