import { env } from "cloudflare:workers";
import { inArray } from "drizzle-orm";

import { getDb } from "@/db";
import { cmsCategories, cmsMedia } from "@/db/schema";

import { parseCmsDocument, serializeCmsDocument } from "../domain/cms-document";
import { mediaUrl } from "../domain/media";
import {
  createArticleSchema,
  listArticlesSchema,
  publishArticleSchema,
  updateArticleSchema,
} from "../domain/validation";
import { publicationState } from "../domain/workflow";
import { requireArticleAccess, requireCmsPermission } from "./cms-auth";
import { CmsError, notFound } from "./cms-errors";
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
} from "./cms.repository";

const db = () => getDb(env);
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
  return { ...item, categoryIds: categories.map((category) => category.categoryId) };
}
export async function createArticle(input: unknown) {
  const session = await requireCmsPermission("cmsArticle", "create");
  const data = createArticleSchema.parse(input);
  const id = crypto.randomUUID();
  const now = new Date();
  try {
    await db().batch([
      db()
        .insert(cmsArticles)
        .values({
          id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: serializeCmsDocument(data.content),
          coverMediaId: data.coverMediaId,
          authorId: session.user.id,
          lastEditedById: session.user.id,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          canonicalUrl: data.canonicalUrl,
          noIndex: data.noIndex,
          createdAt: now,
          updatedAt: now,
        }),
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      ...(data.categoryIds.map((categoryId) =>
        db().insert(cmsArticleCategories).values({ articleId: id, categoryId }),
      ) as []),
      db()
        .insert(cmsAuditLogs)
        .values(auditInsert(session.user.id, "article.created", "article", id)),
    ]);
  } catch (error) {
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
  const revision = (await articleRepository(database).nextRevision(current.id))[0]?.value ?? 1;
  const now = new Date();
  const values = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
    ...(data.content !== undefined && { content: serializeCmsDocument(data.content) }),
    ...(data.coverMediaId !== undefined && { coverMediaId: data.coverMediaId }),
    ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
    ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
    ...(data.canonicalUrl !== undefined && { canonicalUrl: data.canonicalUrl }),
    ...(data.noIndex !== undefined && { noIndex: data.noIndex }),
    lastEditedById: session.user.id,
    updatedAt: now,
    version: current.version + 1,
  };
  const changedSlug =
    data.slug && data.slug !== current.slug && ["published", "scheduled"].includes(current.status);
  const statements = [
    database.insert(cmsArticleRevisions).values({
      articleId: current.id,
      revision,
      snapshot: JSON.stringify(current),
      createdById: session.user.id,
    }),
    database
      .update(cmsArticles)
      .set(values)
      .where(
        and(
          eq(cmsArticles.id, current.id),
          eq(cmsArticles.version, data.version),
          isNull(cmsArticles.deletedAt),
        ),
      ),
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
    ...(changedSlug
      ? [
          database.insert(cmsRedirects).values({
            sourcePath: `/blog/${current.slug}`,
            destinationPath: `/blog/${data.slug}`,
            entityType: "article",
            entityId: current.id,
          }),
        ]
      : []),
    database
      .insert(cmsAuditLogs)
      .values(
        auditInsert(
          session.user.id,
          changedSlug ? "article.slug_changed" : "article.updated",
          "article",
          current.id,
          { fromStatus: current.status },
        ),
      ),
  ];
  try {
    await database.batch(statements as [(typeof statements)[0], ...typeof statements]); // oxlint-disable-line typescript/no-unsafe-type-assertion
  } catch (error) {
    if (String(error).includes("UNIQUE"))
      throw new CmsError(409, "SLUG_CONFLICT", "Slug already in use");
    throw error;
  }
  const updated = await articleRepository(database).byId(current.id);
  if (!updated || updated.version === current.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  return updated;
}
export async function publishArticle(input: unknown) {
  const session = await requireCmsPermission("cmsArticle", "publish");
  const data = publishArticleSchema.parse(input);
  const database = db();
  const current = await articleRepository(database).byId(data.id);
  if (!current) throw notFound("article");
  requireArticleAccess(session.user, current, "publish");
  const state = publicationState(data.publishedAt);
  const result = await database
    .update(cmsArticles)
    .set({
      ...state,
      version: current.version + 1,
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
  if (!result.length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  await database
    .insert(cmsAuditLogs)
    .values(
      auditInsert(
        session.user.id,
        state.status === "scheduled" ? "article.scheduled" : "article.published",
        "article",
        current.id,
      ),
    );
  return articleRepository(database).byId(current.id);
}
export async function archiveArticle(input: { id: string; version: number }) {
  const session = await requireCmsPermission("cmsArticle", "delete");
  const database = db();
  const current = await articleRepository(database).byId(input.id);
  if (!current) throw notFound("article");
  requireArticleAccess(session.user, current, "delete");
  const result = await database
    .update(cmsArticles)
    .set({
      status: "archived",
      version: current.version + 1,
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
  if (!result.length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  await database
    .insert(cmsAuditLogs)
    .values(auditInsert(session.user.id, "article.archived", "article", input.id));
  return { ok: true };
}
export async function unpublishArticle(input: { id: string; version: number }) {
  const session = await requireCmsPermission("cmsArticle", "publish");
  const database = db();
  const current = await articleRepository(database).byId(input.id);
  if (!current) throw notFound("article");
  requireArticleAccess(session.user, current, "publish");
  const result = await database
    .update(cmsArticles)
    .set({
      status: "draft",
      publishedAt: null,
      version: current.version + 1,
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
  if (!result.length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  await database
    .insert(cmsAuditLogs)
    .values(auditInsert(session.user.id, "article.unpublished", "article", input.id));
  return articleRepository(database).byId(input.id);
}
export async function restoreArticle(input: { id: string; version: number }) {
  const session = await requireCmsPermission("cmsArticle", "restore");
  const database = db();
  const current = await articleRepository(database).byId(input.id);
  if (!current) throw notFound("article");
  const result = await database
    .update(cmsArticles)
    .set({
      status: "draft",
      publishedAt: null,
      deletedAt: null,
      version: current.version + 1,
      updatedAt: new Date(),
      lastEditedById: session.user.id,
    })
    .where(and(eq(cmsArticles.id, input.id), eq(cmsArticles.version, input.version)))
    .returning({ id: cmsArticles.id });
  if (!result.length)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  await database
    .insert(cmsAuditLogs)
    .values(auditInsert(session.user.id, "article.restored", "article", input.id));
  return articleRepository(database).byId(input.id);
}
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
  const snapshot = parsedSnapshot as typeof current; // oxlint-disable-line typescript/no-unsafe-type-assertion
  const nextRevision = (await articleRepository(database).nextRevision(current.id))[0]?.value ?? 1;
  const result = await database.batch([
    database.insert(cmsArticleRevisions).values({
      articleId: current.id,
      revision: nextRevision,
      snapshot: JSON.stringify(current),
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
        coverMediaId: snapshot.coverMediaId,
        seoTitle: snapshot.seoTitle,
        seoDescription: snapshot.seoDescription,
        canonicalUrl: snapshot.canonicalUrl,
        noIndex: snapshot.noIndex,
        status: "draft",
        publishedAt: null,
        version: current.version + 1,
        updatedAt: new Date(),
        lastEditedById: session.user.id,
      })
      .where(and(eq(cmsArticles.id, current.id), eq(cmsArticles.version, input.version))),
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
export async function listPublishedArticles(limit?: number) {
  const items = await articleRepository(db()).listPublic(Math.min(limit ?? 20, 50));
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

async function hydratePublicArticles<
  T extends { id: string; content: string; coverMediaId: string | null },
>(items: T[]) {
  if (!items.length) return [];
  const articleIds = items.map((item) => item.id);
  const categoryRows = await db()
    .select({
      articleId: cmsArticleCategories.articleId,
      name: cmsCategories.name,
      slug: cmsCategories.slug,
    })
    .from(cmsArticleCategories)
    .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
    .where(inArray(cmsArticleCategories.articleId, articleIds));
  const mediaIds = new Set<string>();
  for (const item of items) {
    if (item.coverMediaId) mediaIds.add(item.coverMediaId);
    collectMediaIds(parseCmsDocument(item.content).content, mediaIds);
  }
  const mediaRows = mediaIds.size
    ? await db()
        .select()
        .from(cmsMedia)
        .where(and(inArray(cmsMedia.id, [...mediaIds]), isNull(cmsMedia.deletedAt)))
    : [];
  const media = mediaRows.map((item) => ({
    id: item.id,
    url: mediaUrl(env.MEDIA_PUBLIC_URL, item.storageKey),
    altText: item.altText,
    caption: item.caption,
  }));
  return items.map((item) => ({
    ...item,
    categories: categoryRows
      .filter((category) => category.articleId === item.id)
      .map(({ name, slug }) => ({ name, slug })),
    media,
    cover: item.coverMediaId
      ? (media.find((entry) => entry.id === item.coverMediaId) ?? null)
      : null,
  }));
}

function collectMediaIds(nodes: Array<Record<string, unknown>> | undefined, ids: Set<string>) {
  for (const node of nodes ?? []) {
    if (node.type === "mediaImage" && node.attrs && typeof node.attrs === "object") {
      const mediaId = (node.attrs as Record<string, unknown>).mediaId; // oxlint-disable-line typescript/no-unsafe-type-assertion
      if (typeof mediaId === "string") ids.add(mediaId);
    }
    if (Array.isArray(node.content))
      collectMediaIds(node.content as Array<Record<string, unknown>>, ids); // oxlint-disable-line typescript/no-unsafe-type-assertion
  }
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
