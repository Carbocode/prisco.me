import { and, eq, exists, inArray, isNull, lte, sql, type SQLWrapper } from "drizzle-orm";

import { cmsArticleCategories, cmsArticles, cmsCategories, cmsHomeFeatured } from "@/db/schema";

import type { HomeFeaturedCategory } from "../domain/home-featured";
import type { CmsDb } from "./cms.repository";

export function homeFeaturedEligibility(db: CmsDb, category: HomeFeaturedCategory | SQLWrapper) {
  return and(
    isNull(cmsArticles.deletedAt),
    inArray(cmsArticles.status, ["published", "scheduled"]),
    lte(cmsArticles.publishedAt, new Date()),
    exists(
      db
        .select({ id: cmsCategories.id })
        .from(cmsArticleCategories)
        .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
        .where(
          and(
            eq(cmsArticleCategories.articleId, cmsArticles.id),
            eq(cmsCategories.slug, category),
            isNull(cmsCategories.deletedAt),
          ),
        ),
    ),
  );
}

export function listHomeFeatured(db: CmsDb) {
  return db
    .select({
      category: cmsHomeFeatured.category,
      articleId: cmsHomeFeatured.articleId,
      title: cmsArticles.title,
      visible:
        sql<boolean>`coalesce(${homeFeaturedEligibility(db, cmsHomeFeatured.category)}, 0)`.mapWith(
          Boolean,
        ),
    })
    .from(cmsHomeFeatured)
    .innerJoin(cmsArticles, eq(cmsArticles.id, cmsHomeFeatured.articleId))
    .orderBy(cmsHomeFeatured.category, cmsHomeFeatured.position);
}

export async function addHomeFeatured(
  db: CmsDb,
  category: HomeFeaturedCategory,
  articleId: string,
) {
  // Select and claim a free position in one statement so concurrent writes cannot overfill it.
  const result = await db.run(sql`
    WITH positions(position) AS (VALUES (1), (2))
    INSERT INTO ${cmsHomeFeatured} (category, position, article_id)
    SELECT ${category}, positions.position, ${cmsArticles.id}
    FROM positions CROSS JOIN ${cmsArticles}
    WHERE ${cmsArticles.id} = ${articleId} AND ${homeFeaturedEligibility(db, category)}
      AND NOT EXISTS (
        SELECT 1 FROM ${cmsHomeFeatured}
        WHERE ${cmsHomeFeatured.category} = ${category}
          AND (${cmsHomeFeatured.position} = positions.position OR ${cmsHomeFeatured.articleId} = ${articleId})
      )
    ORDER BY positions.position
    LIMIT 1
  `);
  return result.meta.changes > 0;
}

export async function removeHomeFeatured(
  db: CmsDb,
  category: HomeFeaturedCategory,
  articleId: string,
) {
  await db
    .delete(cmsHomeFeatured)
    .where(and(eq(cmsHomeFeatured.category, category), eq(cmsHomeFeatured.articleId, articleId)));
}
