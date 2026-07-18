import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

import { listPublicCategoriesFn } from "@/features/cms/server/public.functions";
import { resolveArchive } from "@/features/content/archive";
import { ContentArchivePage } from "@/features/content/content-components";
import { archiveHead } from "@/features/content/content-seo";
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

export const Route = createFileRoute("/$archiveSlug/")({
  validateSearch: searchSchema,
  loader: async ({ params }) => {
    const [articles, categories] = await Promise.all([
      listPublishedArticlesByFilterFn({ data: {} }),
      listPublicCategoriesFn(),
    ]);
    const archive = resolveArchive(params.archiveSlug, articles, categories);
    if (!archive) throw notFound();
    return archive;
  },
  head: ({ loaderData }) => (loaderData ? archiveHead(loaderData) : {}),
  component: ArchivePage,
});

function ArchivePage() {
  const archive = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = (changes: {
    page?: number;
    q?: string;
    tag?: string;
    organization?: string;
    author?: string;
    year?: string;
  }) =>
    navigate({
      search: (current) => ({ ...current, ...changes }),
      replace: true,
    });

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
