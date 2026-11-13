import { getRouteApi } from "@tanstack/react-router";

import { ArticlePageContent } from "@/features/content/components/article-page-content";
import { ContentArchivePage } from "@/features/content/components/content-archive-page";
/* oxlint-disable no-underscore-dangle -- TanStack Router espone il parametro splat come `_splat`. */
import { type ContentArchive } from "@/features/content/domain/archive";
import { makeCrumbs } from "@/features/content/domain/breadcrumbs";

const routeApi = getRouteApi("/$archiveSlug/$");

export function DatedOrArticlePage() {
  const data = routeApi.useLoaderData();
  if (data.type === "article") {
    return (
      <ArticlePageContent article={data.article} crumbs={makeCrumbs(data.archive, data.article)} />
    );
  }
  return <ArchiveContent archive={data.archive} />;
}

function ArchiveContent({ archive }: { archive: ContentArchive }) {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
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
