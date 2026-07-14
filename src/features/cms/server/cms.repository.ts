import { and, asc, count, desc, eq, inArray, isNull, like, lte, ne, or, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import type * as schema from "@/db/schema";
import {
  cmsArticleCategories,
  cmsArticleRevisions,
  cmsArticles,
  cmsAuditLogs,
  cmsCategories,
  cmsRedirects,
  cmsServiceRevisions,
  cmsServices,
} from "@/db/schema";

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
    }) {
      const filters = [isNull(cmsArticles.deletedAt)];
      if (input.status) filters.push(eq(cmsArticles.status, input.status));
      if (input.authorId) filters.push(eq(cmsArticles.authorId, input.authorId));
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
          .select()
          .from(cmsArticles)
          .where(where)
          .orderBy(desc(cmsArticles.updatedAt))
          .limit(input.pageSize)
          .offset((input.page - 1) * input.pageSize),
        db.select({ value: count() }).from(cmsArticles).where(where),
      ]);
      return { items, total: total[0]?.value ?? 0 };
    },
    listPublic(limit = 20) {
      return db
        .select({
          id: cmsArticles.id,
          title: cmsArticles.title,
          slug: cmsArticles.slug,
          excerpt: cmsArticles.excerpt,
          content: cmsArticles.content,
          publishedAt: cmsArticles.publishedAt,
          seoTitle: cmsArticles.seoTitle,
          seoDescription: cmsArticles.seoDescription,
          canonicalUrl: cmsArticles.canonicalUrl,
          noIndex: cmsArticles.noIndex,
          coverMediaId: cmsArticles.coverMediaId,
        })
        .from(cmsArticles)
        .where(
          and(
            isNull(cmsArticles.deletedAt),
            inArray(cmsArticles.status, ["published", "scheduled"]),
            lte(cmsArticles.publishedAt, new Date()),
          ),
        )
        .orderBy(desc(cmsArticles.publishedAt), desc(cmsArticles.id))
        .limit(limit);
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

export function serviceRepository(db: CmsDb) {
  return {
    byId: (id: string) => db.query.cmsServices.findFirst({ where: eq(cmsServices.id, id) }),
    bySlug: (slug: string) => db.query.cmsServices.findFirst({ where: eq(cmsServices.slug, slug) }),
    listAdmin: () =>
      db
        .select()
        .from(cmsServices)
        .where(isNull(cmsServices.deletedAt))
        .orderBy(asc(cmsServices.sortOrder), asc(cmsServices.name)),
    listPublic: () =>
      db
        .select()
        .from(cmsServices)
        .where(
          and(
            isNull(cmsServices.deletedAt),
            eq(cmsServices.status, "published"),
            lte(cmsServices.publishedAt, new Date()),
          ),
        )
        .orderBy(asc(cmsServices.sortOrder), asc(cmsServices.name)),
    publicBySlug: (slug: string) =>
      db
        .select()
        .from(cmsServices)
        .where(
          and(
            eq(cmsServices.slug, slug),
            isNull(cmsServices.deletedAt),
            eq(cmsServices.status, "published"),
            lte(cmsServices.publishedAt, new Date()),
          ),
        )
        .limit(1),
    nextRevision(serviceId: string) {
      return db
        .select({ value: sql<number>`coalesce(max(${cmsServiceRevisions.revision}), 0) + 1` })
        .from(cmsServiceRevisions)
        .where(eq(cmsServiceRevisions.serviceId, serviceId));
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
  cmsServiceRevisions,
  cmsServices,
  eq,
  isNull,
  ne,
};
