import { cmsCategories } from "@/db/schema";
import { publishArticleSchema } from "@/features/cms/domain/validation";
import { publicationState } from "@/features/cms/domain/workflow";
import { assertArticleRelations } from "@/features/cms/server/article-relations";
import { db } from "@/features/cms/server/articles/connection";
import { getAdminArticle } from "@/features/cms/server/articles/queries";
import { transitionSnapshot } from "@/features/cms/server/articles/revision-snapshot";
import { requireArticleAccess, requireCmsPermission } from "@/features/cms/server/cms-auth";
import { CmsError, notFound } from "@/features/cms/server/cms-errors";
import {
  and,
  articleRepository,
  auditInsert,
  cmsArticles,
  cmsAuditLogs,
  cmsRedirects,
  eq,
  isNull,
} from "@/features/cms/server/cms.repository";

export function publicArchiveSlug(categorySlug: string | undefined) {
  if (!categorySlug) throw new Error("Published articles must have a category");
  return categorySlug;
}

export async function publishArticle(input: unknown) {
  const session = await requireCmsPermission("cmsArticle", "publish");
  const data = publishArticleSchema.parse(input);
  const database = db();
  const current = await articleRepository(database).byId(data.id);
  if (!current) throw notFound("article");
  requireArticleAccess(session.user, current, "publish");
  if (current.version !== data.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  await assertArticleRelations(database, await getAdminArticle(current.id));
  const publishedCategory = await database.query.cmsCategories.findFirst({
    where: eq(cmsCategories.id, (await getAdminArticle(current.id)).categoryIds[0] ?? ""),
  });
  const publishedPath = `/${publishedCategory?.slug}/${current.slug}`;
  const state = publicationState(data.publishedAt);
  const mutation = database
    .update(cmsArticles)
    .set({
      ...state,
      version: data.version + 1,
      updatedAt: new Date(),
      lastEditedById: session.user.id,
    })
    .where(
      and(
        eq(cmsArticles.id, current.id),
        eq(cmsArticles.version, data.version),
        isNull(cmsArticles.deletedAt),
      ),
    )
    .returning({ id: cmsArticles.id });
  const result = await database.batch([
    (await transitionSnapshot(database, current, session.user.id)).statement,
    mutation,
    database.delete(cmsRedirects).where(eq(cmsRedirects.sourcePath, publishedPath)),
    database
      .insert(cmsAuditLogs)
      .values(
        auditInsert(
          session.user.id,
          state.status === "scheduled" ? "article.scheduled" : "article.published",
          "article",
          current.id,
        ),
      ),
  ]);
  if (!result[1].length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");

  return articleRepository(database).byId(current.id);
}

export async function archiveArticle(input: { id: string; version: number }) {
  const session = await requireCmsPermission("cmsArticle", "delete");
  const database = db();
  const current = await articleRepository(database).byId(input.id);
  if (!current) throw notFound("article");
  requireArticleAccess(session.user, current, "delete");
  if (current.version !== input.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  const mutation = database
    .update(cmsArticles)
    .set({
      status: "archived",
      version: input.version + 1,
      updatedAt: new Date(),
      lastEditedById: session.user.id,
    })
    .where(
      and(
        eq(cmsArticles.id, input.id),
        eq(cmsArticles.version, input.version),
        isNull(cmsArticles.deletedAt),
      ),
    )
    .returning({ id: cmsArticles.id });
  const result = await database.batch([
    (await transitionSnapshot(database, current, session.user.id)).statement,
    mutation,
    database
      .insert(cmsAuditLogs)
      .values(auditInsert(session.user.id, "article.archived", "article", input.id)),
  ]);
  if (!result[1].length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");

  return { ok: true };
}

export async function unpublishArticle(input: { id: string; version: number }) {
  const session = await requireCmsPermission("cmsArticle", "publish");
  const database = db();
  const current = await articleRepository(database).byId(input.id);
  if (!current) throw notFound("article");
  requireArticleAccess(session.user, current, "publish");
  if (current.version !== input.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  const mutation = database
    .update(cmsArticles)
    .set({
      status: "draft",
      publishedAt: null,
      version: input.version + 1,
      updatedAt: new Date(),
      lastEditedById: session.user.id,
    })
    .where(
      and(
        eq(cmsArticles.id, input.id),
        eq(cmsArticles.version, input.version),
        isNull(cmsArticles.deletedAt),
      ),
    )
    .returning({ id: cmsArticles.id });
  const result = await database.batch([
    (await transitionSnapshot(database, current, session.user.id)).statement,
    mutation,
    database
      .insert(cmsAuditLogs)
      .values(auditInsert(session.user.id, "article.unpublished", "article", input.id)),
  ]);
  if (!result[1].length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");

  return articleRepository(database).byId(input.id);
}

export async function restoreArticle(input: { id: string; version: number }) {
  const session = await requireCmsPermission("cmsArticle", "restore");
  const database = db();
  const current = await articleRepository(database).byId(input.id);
  if (!current) throw notFound("article");
  if (current.version !== input.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  const mutation = database
    .update(cmsArticles)
    .set({
      status: "draft",
      publishedAt: null,
      deletedAt: null,
      version: input.version + 1,
      updatedAt: new Date(),
      lastEditedById: session.user.id,
    })
    .where(and(eq(cmsArticles.id, input.id), eq(cmsArticles.version, input.version)))
    .returning({ id: cmsArticles.id });
  const result = await database.batch([
    (await transitionSnapshot(database, current, session.user.id)).statement,
    mutation,
    database
      .insert(cmsAuditLogs)
      .values(auditInsert(session.user.id, "article.restored", "article", input.id)),
  ]);
  if (!result[1].length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");

  return articleRepository(database).byId(input.id);
}
