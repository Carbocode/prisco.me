import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

import { listPublicCategoriesFn } from "@/features/cms/server/public.functions";
import { resolveArchive } from "@/features/content/domain/archive";
import { ArchivePage } from "@/features/content/pages/archive-page";
import { archiveHead } from "@/features/content/seo/content-seo";
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
