import { env } from "cloudflare:workers";
import { asc, inArray } from "drizzle-orm";

import { cmsArticleTags, cmsCategories, cmsMedia, cmsOrganizations, cmsTags } from "@/db/schema";
import { mediaDeliveryBaseUrl, mediaUrl } from "@/features/cms/domain/media";
import { mediaIdsInDocument } from "@/features/cms/domain/media-associations";
import { db } from "@/features/cms/server/articles/connection";
import { publicAuthor } from "@/features/cms/server/articles/public-author";
import {
  and,
  articleRepository,
  cmsArticleCategories,
  eq,
  isNull,
} from "@/features/cms/server/cms.repository";
import { parseCmsDocument } from "@/features/content/domain/document";

export async function hydratePublicArticles<
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
    .where(
      and(inArray(cmsArticleCategories.articleId, articleIds), isNull(cmsCategories.deletedAt)),
    );
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
