import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

import { listPublicCategoriesFn } from "@/features/cms/server/public.functions";
import { resolveArchive } from "@/features/content/archive";
import { ContentArchivePage } from "@/features/content/content-components";
import { archiveHead } from "@/features/content/content-seo";
import { listPublishedArticlesByFilterFn } from "@/features/content/content.functions";

const searchSchema = z.object({
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
      query={search.q ?? ""}
      tag={search.tag ?? "all"}
      organization={search.organization ?? "all"}
      author={search.author ?? "all"}
      year={search.year ?? "all"}
      onQueryChange={(q) => updateSearch({ q: q || undefined })}
      onTagChange={(tag) => updateSearch({ tag: tag === "all" ? undefined : tag })}
      onOrganizationChange={(organization) =>
        updateSearch({ organization: organization === "all" ? undefined : organization })
      }
      onAuthorChange={(author) => updateSearch({ author: author === "all" ? undefined : author })}
      onYearChange={(year) => updateSearch({ year: year === "all" ? undefined : year })}
      onReset={() =>
        updateSearch({
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
