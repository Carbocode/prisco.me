import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  inArray,
  isNull,
  like,
  lt,
  lte,
  ne,
  or,
  sql,
} from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import type * as schema from "@/db/schema";
import {
  cmsArticleCategories,
  cmsArticleRevisions,
  cmsArticles,
  cmsAuditLogs,
  cmsCategories,
  cmsRedirects,
} from "@/db/schema";
import { user } from "@/db/schema";

export type CmsDb = DrizzleD1Database<typeof schema>;
export function articleRepository(db: CmsDb) {
  return {
    byId: (id: string) => db.query.cmsArticles.findFirst({ where: eq(cmsArticles.id, id) }),
    bySlug: (slug: string) => db.query.cmsArticles.findFirst({ where: eq(cmsArticles.slug, slug) }),
    async listAdmin(input: {
      page: number;
      pageSize: number;
      query?: string;
      status?: string;
      authorId?: string;
      categoryId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }) {
      const filters = [isNull(cmsArticles.deletedAt)];
      if (input.status) filters.push(eq(cmsArticles.status, input.status));
      if (input.authorId) filters.push(eq(cmsArticles.authorId, input.authorId));
      if (input.categoryId)
        filters.push(
          inArray(
            cmsArticles.id,
            db
              .select({ articleId: cmsArticleCategories.articleId })
              .from(cmsArticleCategories)
              .where(eq(cmsArticleCategories.categoryId, input.categoryId)),
          ),
        );
      if (input.dateFrom) filters.push(gte(cmsArticles.updatedAt, input.dateFrom));
      if (input.dateTo) filters.push(lte(cmsArticles.updatedAt, input.dateTo));
      if (input.query)
        filters.push(
          or(
            like(cmsArticles.title, `%${input.query}%`),
            like(cmsArticles.slug, `%${input.query}%`),
          )!,
        );
      const where = and(...filters);
      const [items, total] = await Promise.all([
        db
          .select({ ...getTableColumns(cmsArticles), authorName: user.name })
          .from(cmsArticles)
          .leftJoin(user, eq(cmsArticles.authorId, user.id))
          .where(where)
          .orderBy(desc(cmsArticles.updatedAt))
          .limit(input.pageSize)
          .offset((input.page - 1) * input.pageSize),
        db.select({ value: count() }).from(cmsArticles).where(where),
      ]);
      const categoryRows = items.length
        ? await db
            .select({
              articleId: cmsArticleCategories.articleId,
              name: cmsCategories.name,
              archiveSort: cmsCategories.archiveSort,
            })
            .from(cmsArticleCategories)
            .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
            .where(
              inArray(
                cmsArticleCategories.articleId,
                items.map((item) => item.id),
              ),
            )
        : [];
      return {
        items: items.map((item) => ({
          ...item,
          categories: categoryRows
            .filter((category) => category.articleId === item.id)
            .map((category) => category.name),
          archiveSort: categoryRows.find((category) => category.articleId === item.id)?.archiveSort,
        })),
        total: total[0]?.value ?? 0,
      };
    },
    listPublic(limit = 20, cursor?: { publishedAt: Date; id: string }) {
      const cursorFilter = cursor
        ? or(
            lt(cmsArticles.publishedAt, cursor.publishedAt),
            and(eq(cmsArticles.publishedAt, cursor.publishedAt), lt(cmsArticles.id, cursor.id)),
          )
        : undefined;
      return db
        .select({
          id: cmsArticles.id,
          title: cmsArticles.title,
          slug: cmsArticles.slug,
          excerpt: cmsArticles.excerpt,
          content: cmsArticles.content,
          publishedAt: cmsArticles.publishedAt,
          updatedAt: cmsArticles.updatedAt,
          seoTitle: cmsArticles.seoTitle,
          seoDescription: cmsArticles.seoDescription,
          canonicalUrl: cmsArticles.canonicalUrl,
          noIndex: cmsArticles.noIndex,
          coverMediaId: cmsArticles.coverMediaId,
          authorId: cmsArticles.authorId,
          organizationId: cmsArticles.organizationId,
          projectRole: cmsArticles.projectRole,
          projectPeriod: cmsArticles.projectPeriod,
          projectFeatured: cmsArticles.projectFeatured,
          projectSortOrder: cmsArticles.projectSortOrder,
        })
        .from(cmsArticles)
        .where(
          and(
            isNull(cmsArticles.deletedAt),
            inArray(cmsArticles.status, ["published", "scheduled"]),
            lte(cmsArticles.publishedAt, new Date()),
            cursorFilter,
          ),
        )
        .orderBy(desc(cmsArticles.publishedAt), desc(cmsArticles.id))
        .limit(limit);
    },
    listPublicArchive() {
      return db
        .select({
          id: cmsArticles.id,
          title: cmsArticles.title,
          slug: cmsArticles.slug,
          excerpt: cmsArticles.excerpt,
          content: cmsArticles.content,
          publishedAt: cmsArticles.publishedAt,
          updatedAt: cmsArticles.updatedAt,
          seoTitle: cmsArticles.seoTitle,
          seoDescription: cmsArticles.seoDescription,
          canonicalUrl: cmsArticles.canonicalUrl,
          noIndex: cmsArticles.noIndex,
          coverMediaId: cmsArticles.coverMediaId,
          authorId: cmsArticles.authorId,
          organizationId: cmsArticles.organizationId,
          projectRole: cmsArticles.projectRole,
          projectPeriod: cmsArticles.projectPeriod,
          projectFeatured: cmsArticles.projectFeatured,
          projectSortOrder: cmsArticles.projectSortOrder,
        })
        .from(cmsArticles)
        .where(
          and(
            isNull(cmsArticles.deletedAt),
            inArray(cmsArticles.status, ["published", "scheduled"]),
            lte(cmsArticles.publishedAt, new Date()),
          ),
        )
        .orderBy(desc(cmsArticles.publishedAt), desc(cmsArticles.id));
    },
    publicBySlug(slug: string) {
      return db
        .select()
        .from(cmsArticles)
        .where(
          and(
            eq(cmsArticles.slug, slug),
            isNull(cmsArticles.deletedAt),
            inArray(cmsArticles.status, ["published", "scheduled"]),
            lte(cmsArticles.publishedAt, new Date()),
          ),
        )
        .limit(1);
    },
    publicAuthorsByIds(ids: string[]) {
      return db
        .select({ id: user.id, name: user.name, username: user.username })
        .from(user)
        .where(inArray(user.id, ids));
    },
    nextRevision(articleId: string) {
      return db
        .select({ value: sql<number>`coalesce(max(${cmsArticleRevisions.revision}), 0) + 1` })
        .from(cmsArticleRevisions)
        .where(eq(cmsArticleRevisions.articleId, articleId));
    },
    revisions(articleId: string) {
      return db
        .select()
        .from(cmsArticleRevisions)
        .where(eq(cmsArticleRevisions.articleId, articleId))
        .orderBy(desc(cmsArticleRevisions.createdAt))
        .limit(50);
    },
  };
}

export const auditInsert = (
  actorId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: unknown,
) => ({
  id: crypto.randomUUID(),
  actorId,
  action,
  entityType,
  entityId,
  metadata: metadata ? JSON.stringify(metadata) : null,
  createdAt: new Date(),
});
export {
  and,
  cmsArticleCategories,
  cmsArticleRevisions,
  cmsArticles,
  cmsAuditLogs,
  cmsCategories,
  cmsRedirects,
  eq,
  isNull,
  ne,
};
