/* oxlint-disable no-underscore-dangle -- TanStack Router espone il parametro splat come `_splat`. */
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

import { listPublicCategoriesFn } from "@/features/cms/server/public.functions";
import {
  resolveArchive,
  resolveDateArchive,
  type ContentArchive,
} from "@/features/content/archive";
import {
  ArticlePageContent,
  ContentArchivePage,
  type PublicArticle,
} from "@/features/content/content-components";
import { archiveHead, articleHead } from "@/features/content/content-seo";
import { listPublishedArticlesByFilterFn } from "@/features/content/content.functions";

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

export const Route = createFileRoute("/$archiveSlug/$")({
  validateSearch: searchSchema,
  loader: async ({ params }): Promise<RouteData> => {
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

function DatedOrArticlePage() {
  const data = Route.useLoaderData();
  if (data.type === "article") {
    return (
      <ArticlePageContent article={data.article} crumbs={makeCrumbs(data.archive, data.article)} />
    );
  }
  return <ArchiveContent archive={data.archive} />;
}

function ArchiveContent({ archive }: { archive: ContentArchive }) {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = (changes: {
    page?: number;
    q?: string;
    tag?: string;
    organization?: string;
    author?: string;
    year?: string;
  }) => navigate({ search: (current) => ({ ...current, ...changes }), replace: true });

  return (
    <ContentArchivePage
      {...archive}
      archiveSlug={archive.slug}
      page={search.page ?? 1}
      query={search.q ?? ""}
      tag={search.tag ?? "all"}
      organization={search.organization ?? "all"}
      author={search.author ?? "all"}
      year={search.year ?? "all"}
      onQueryChange={(q) => updateSearch({ q: q || undefined, page: 1 })}
      onTagChange={(tag) => updateSearch({ tag: tag === "all" ? undefined : tag, page: 1 })}
      onOrganizationChange={(organization) =>
        updateSearch({
          organization: organization === "all" ? undefined : organization,
          page: 1,
        })
      }
      onAuthorChange={(author) =>
        updateSearch({ author: author === "all" ? undefined : author, page: 1 })
      }
      onYearChange={(year) => updateSearch({ year: year === "all" ? undefined : year, page: 1 })}
      onPageChange={(page) => updateSearch({ page })}
      onReset={() =>
        updateSearch({
          page: 1,
          q: undefined,
          tag: undefined,
          organization: undefined,
          author: undefined,
          year: undefined,
        })
      }
    />
  );
}

function canonicalArchiveSlug(article: { categories: Array<{ slug: string }> }) {
  const category = article.categories[0]?.slug;
  if (!category) throw new Error("Published articles must have a category");
  return category;
}

function makeCrumbs(archive: ContentArchive, article: PublicArticle) {
  const base = `/${archive.slug}`;
  return [
    { name: archive.title, url: base },
    { name: article.title, url: `${base}/${article.slug}` },
  ];
}
