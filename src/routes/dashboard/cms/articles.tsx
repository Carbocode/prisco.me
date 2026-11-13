/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/mini";

import { ArticlesContent } from "@/features/cms/pages/articles-page";
import { listArticlesFn } from "@/features/cms/server/article.functions";
import { listCategoriesFn } from "@/features/cms/server/category.functions";

const searchSchema = z.object({
  page: z.catch(z.coerce.number().check(z.int(), z.positive()), 1),
  pageSize: z.catch(
    z.optional(z.pipe(z.coerce.number(), z.union([z.literal(10), z.literal(20), z.literal(50)]))),
    20,
  ),
  query: z.catch(z.optional(z.string()), undefined),
  status: z.catch(z.optional(z.enum(["draft", "scheduled", "published", "archived"])), undefined),
  categoryId: z.catch(z.optional(z.uuid()), undefined),
});

export const Route = createFileRoute("/dashboard/cms/articles")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [articles, categories] = await Promise.all([
      listArticlesFn({ data: { ...deps, pageSize: deps.pageSize ?? 20 } }),
      listCategoriesFn(),
    ]);
    return { articles, categories };
  },
  component: ArticlesContent,
});
