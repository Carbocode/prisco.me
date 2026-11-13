/* oxlint-disable no-underscore-dangle -- TanStack Router espone il parametro splat come `_splat`. */
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { z } from "zod";

import {
  getPublishedArticleFn,
  getCmsRedirectFn,
  listPublicCategoriesFn,
} from "@/features/cms/server/public.functions";
import {
  resolveArchive,
  resolveDateArchive,
  type ContentArchive,
} from "@/features/content/domain/archive";
import { makeCrumbs } from "@/features/content/domain/breadcrumbs";
import { type PublicArticle } from "@/features/content/domain/public-content";
import { DatedOrArticlePage } from "@/features/content/pages/article-page";
import { archiveHead, articleHead } from "@/features/content/seo/content-seo";
import { listPublishedArticlesByFilterFn } from "@/features/content/server/content.functions";

const searchSchema = z.object({
  page: z.coerce.number().int().positive().optional().catch(undefined),
  q: z.string().max(120).optional().catch(undefined),
  tag: z.string().max(180).optional().catch(undefined),
  organization: z.string().max(180).optional().catch(undefined),
  author: z.string().max(180).optional().catch(undefined),
  year: z
    .string()
    .regex(/^\d{4}$/)
    .optional()
    .catch(undefined),
});

type RouteData =
  | { type: "archive"; archive: ContentArchive }
  | { type: "article"; archive: ContentArchive; article: PublicArticle };

function resolveDatedPath(
  year: string,
  segments: string[],
  articles: PublicArticle[],
): RouteData | null {
  if (segments.length === 1) {
    if (/^\d+$/.test(segments[0])) {
      const archive = resolveDateArchive(year, articles, segments[0]);
      return archive ? { type: "archive", archive } : null;
    }
    return articleIn(resolveDateArchive(year, articles), segments[0]);
  }

  if (segments.length === 2 && /^\d+$/.test(segments[0])) {
    if (/^\d+$/.test(segments[1])) {
      const archive = resolveDateArchive(year, articles, segments[0], segments[1]);
      return archive ? { type: "archive", archive } : null;
    }
    return articleIn(resolveDateArchive(year, articles, segments[0]), segments[1]);
  }

  if (
    segments.length === 3 &&
    /^\d+$/.test(segments[0]) &&
    /^\d+$/.test(segments[1]) &&
    !/^\d+$/.test(segments[2])
  ) {
    return articleIn(resolveDateArchive(year, articles, segments[0], segments[1]), segments[2]);
  }

  return null;
}

function resolveRegularPath(archive: ContentArchive, segments: string[]): RouteData | null {
  if (segments.length !== 1 || /^\d+$/.test(segments[0])) return null;
  return articleIn(archive, segments[0]);
}

function articleIn(archive: ContentArchive | null, slug: string): RouteData | null {
  const article = archive?.articles.find((item) => item.slug === slug);
  return archive && article ? { type: "article", archive, article } : null;
}

function canonicalArchiveSlug(article: { categories: Array<{ slug: string }> }) {
  const category = article.categories[0]?.slug;
  if (!category) throw new Error("Published articles must have a category");
  return category;
}

export const Route = createFileRoute("/$archiveSlug/$")({
  validateSearch: searchSchema,
  loader: async ({ params }): Promise<RouteData> => {
    const path = `/${params.archiveSlug}/${params._splat ?? ""}`.replace(/\/$/, "");
    const visited = new Set<string>();
    let destination = path;
    while (!visited.has(destination) && visited.size < 20) {
      visited.add(destination);
      const entry = await getCmsRedirectFn({ data: { path: destination } });
      if (!entry) break;
      destination = entry.destinationPath;
    }
    if (destination !== path) {
      const next = await getCmsRedirectFn({ data: { path: destination } });
      if (!next) throw redirect({ href: destination, statusCode: 301 });
    }
    const [articles, categories] = await Promise.all([
      listPublishedArticlesByFilterFn({ data: {} }),
      listPublicCategoriesFn(),
    ]);
    const rootArchive = resolveArchive(params.archiveSlug, articles, categories);
    if (!rootArchive) throw notFound();

    const segments = (params._splat ?? "").split("/").filter(Boolean);
    const data = /^\d+$/.test(params.archiveSlug)
      ? resolveDatedPath(params.archiveSlug, segments, articles)
      : resolveRegularPath(rootArchive, segments);
    if (!data) throw notFound();
    if (data.type === "article") {
      const fullArticle = await getPublishedArticleFn({ data: { slug: data.article.slug } });
      if (!fullArticle) throw notFound();
      return { ...data, article: fullArticle };
    }
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    if (loaderData.type === "archive") return archiveHead(loaderData.archive);
    return articleHead(
      loaderData.article,
      `/${canonicalArchiveSlug(loaderData.article)}/${loaderData.article.slug}`,
      makeCrumbs(loaderData.archive, loaderData.article),
    );
  },
  component: DatedOrArticlePage,
});
