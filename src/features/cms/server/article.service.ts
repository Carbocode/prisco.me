import { env } from "cloudflare:workers";
import { asc, inArray } from "drizzle-orm";

import { getDb } from "@/db";
import { cmsArticleTags, cmsCategories, cmsMedia, cmsOrganizations, cmsTags } from "@/db/schema";

import {
  CURRENT_CONTENT_VERSION,
  parseCmsDocument,
  serializeCmsDocument,
} from "../domain/cms-document";
import { mediaDeliveryBaseUrl, mediaUrl } from "../domain/media";
import { mediaIdsInDocument } from "../domain/media-associations";
import { publicationDateParts } from "../domain/publication-date";
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
  const tags = await db()
    .select({ tagId: cmsArticleTags.tagId })
    .from(cmsArticleTags)
    .innerJoin(cmsTags, eq(cmsArticleTags.tagId, cmsTags.id))
    .where(and(eq(cmsArticleTags.articleId, id), isNull(cmsTags.deletedAt)))
    .orderBy(asc(cmsArticleTags.sortOrder), asc(cmsTags.name));
  return {
    ...item,
    categoryIds: categories.map((category) => category.categoryId),
    tagIds: tags.map((tag) => tag.tagId),
  };
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
          contentVersion: CURRENT_CONTENT_VERSION,
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
          createdAt: now,
          updatedAt: now,
        }),
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      ...(data.categoryIds.map((categoryId) =>
        db().insert(cmsArticleCategories).values({ articleId: id, categoryId }),
      ) as []),
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      ...(data.tagIds.map((tagId, sortOrder) =>
        db().insert(cmsArticleTags).values({ articleId: id, tagId, sortOrder }),
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
  if (current.version !== data.version)
    throw new CmsError(409, "CONTENT_VERSION_CONFLICT", "Content was modified elsewhere");
  const revision = (await articleRepository(database).nextRevision(current.id))[0]?.value ?? 1;
  const now = new Date();
  const values = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
    ...(data.content !== undefined && {
      content: serializeCmsDocument(data.content),
      contentVersion: CURRENT_CONTENT_VERSION,
    }),
    ...(data.coverMediaId !== undefined && { coverMediaId: data.coverMediaId }),
    ...(data.organizationId !== undefined && { organizationId: data.organizationId }),
    ...(data.projectRole !== undefined && { projectRole: data.projectRole }),
    ...(data.projectPeriod !== undefined && { projectPeriod: data.projectPeriod }),
    ...(data.projectFeatured !== undefined && { projectFeatured: data.projectFeatured }),
    ...(data.projectSortOrder !== undefined && { projectSortOrder: data.projectSortOrder }),
    ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
    ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
    ...(data.noIndex !== undefined && { noIndex: data.noIndex }),
    lastEditedById: session.user.id,
    updatedAt: now,
    version: current.version + 1,
  };
  const changedSlug =
    data.slug && data.slug !== current.slug && ["published", "scheduled"].includes(current.status);
  const sourceCategories = changedSlug
    ? await database
        .select({ slug: cmsCategories.slug })
        .from(cmsArticleCategories)
        .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
        .where(eq(cmsArticleCategories.articleId, current.id))
    : [];
  const destinationCategories =
    changedSlug && data.categoryIds
      ? await database
          .select({ slug: cmsCategories.slug })
          .from(cmsCategories)
          .where(inArray(cmsCategories.id, data.categoryIds))
      : sourceCategories;
  const redirectPaths = changedSlug
    ? {
        source: `/${publicArchiveSlug(sourceCategories[0]?.slug)}/${current.slug}`,
        destination: `/${publicArchiveSlug(destinationCategories[0]?.slug)}/${data.slug}`,
      }
    : null;
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
    ...(data.tagIds
      ? [
          database.delete(cmsArticleTags).where(eq(cmsArticleTags.articleId, current.id)),
          ...data.tagIds.map((tagId, sortOrder) =>
            database.insert(cmsArticleTags).values({ articleId: current.id, tagId, sortOrder }),
          ),
        ]
      : []),
    ...(redirectPaths
      ? [
          database.insert(cmsRedirects).values({
            sourcePath: redirectPaths.source,
            destinationPath: redirectPaths.destination,
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

function publicArchiveSlug(categorySlug: string | undefined) {
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

async function hydratePublicArticles<
  T extends {
    id: string;
    content: string;
    coverMediaId: string | null;
    authorId: string;
    organizationId: string | null;
  },
>(items: T[]) {
  if (!items.length) return [];
  const articleIds = items.map((item) => item.id);
  const categoryRows = await db()
    .select({
      articleId: cmsArticleCategories.articleId,
      name: cmsCategories.name,
      slug: cmsCategories.slug,
      schemaType: cmsCategories.schemaType,
    })
    .from(cmsArticleCategories)
    .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
    .where(inArray(cmsArticleCategories.articleId, articleIds));
  const tagRows = await db()
    .select({
      articleId: cmsArticleTags.articleId,
      name: cmsTags.name,
      slug: cmsTags.slug,
      icon: cmsTags.icon,
      color: cmsTags.color,
      mark: cmsTags.mark,
      fluentIcon: cmsTags.fluentIcon,
    })
    .from(cmsArticleTags)
    .innerJoin(cmsTags, eq(cmsArticleTags.tagId, cmsTags.id))
    .where(and(inArray(cmsArticleTags.articleId, articleIds), isNull(cmsTags.deletedAt)))
    .orderBy(asc(cmsArticleTags.articleId), asc(cmsArticleTags.sortOrder), asc(cmsTags.name));
  const authorRows = await articleRepository(db()).publicAuthorsByIds([
    ...new Set(items.map((item) => item.authorId)),
  ]);
  const organizationIds = [
    ...new Set(items.flatMap((item) => (item.organizationId ? [item.organizationId] : []))),
  ];
  const organizationRows = organizationIds.length
    ? await db()
        .select({
          id: cmsOrganizations.id,
          name: cmsOrganizations.name,
          slug: cmsOrganizations.slug,
          type: cmsOrganizations.type,
        })
        .from(cmsOrganizations)
        .where(
          and(inArray(cmsOrganizations.id, organizationIds), isNull(cmsOrganizations.deletedAt)),
        )
    : [];
  const mediaIds = new Set<string>();
  for (const item of items) {
    if (item.coverMediaId) mediaIds.add(item.coverMediaId);
    for (const mediaId of mediaIdsInDocument(parseCmsDocument(item.content))) {
      mediaIds.add(mediaId);
    }
  }
  const mediaRows = mediaIds.size
    ? await db()
        .select()
        .from(cmsMedia)
        .where(and(inArray(cmsMedia.id, [...mediaIds]), isNull(cmsMedia.deletedAt)))
    : [];
  const media = mediaRows.map((item) => ({
    id: item.id,
    url: mediaUrl(
      mediaDeliveryBaseUrl(import.meta.env.MODE, env.MEDIA_PUBLIC_URL),
      item.storageKey,
    ),
    altText: item.altText,
    caption: item.caption,
  }));
  return items.map((item) => ({
    ...item,
    author: publicAuthor(
      authorRows.find((author) => author.id === item.authorId) ?? {
        id: item.authorId,
        name: "Vincenzo Prisco",
        username: null,
      },
    ),
    organization: item.organizationId
      ? (organizationRows.find((organization) => organization.id === item.organizationId) ?? null)
      : null,
    categories: categoryRows
      .filter((category) => category.articleId === item.id)
      .map(({ name, slug, schemaType }) => ({ name, slug, schemaType })),
    tags: tagRows
      .filter((tag) => tag.articleId === item.id)
      .map(({ name, slug, icon, color, mark, fluentIcon }) => ({
        name,
        slug,
        icon,
        color,
        mark,
        fluentIcon,
      })),
    media,
    cover: item.coverMediaId
      ? (media.find((entry) => entry.id === item.coverMediaId) ?? null)
      : null,
  }));
}

function publicAuthor(author: { id: string; name: string; username: string | null }) {
  return {
    name: author.name,
    slug:
      author.username ??
      author.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
  };
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
