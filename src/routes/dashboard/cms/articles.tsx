/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ArticlesContent } from "@/features/cms/pages/articles-page";
import { listArticlesFn } from "@/features/cms/server/article.functions";
import { listCategoryOptionsFn } from "@/features/cms/server/category.functions";

const searchSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  pageSize: z.coerce
    .number()
    .pipe(z.union([z.literal(10), z.literal(20), z.literal(50)]))
    .default(20)
    .catch(20),
  sortBy: z
    .enum(["title", "status", "authorName", "updatedAt", "publishedAt"])
    .default("updatedAt")
    .catch("updatedAt"),
  direction: z.enum(["asc", "desc"]).default("desc").catch("desc"),
  query: z.string().trim().max(160).optional().catch(undefined),
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional().catch(undefined),
  categoryId: z.string().uuid().optional().catch(undefined),
});

export const Route = createFileRoute("/dashboard/cms/articles")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [articles, categories] = await Promise.all([
      listArticlesFn({ data: { ...deps, pageSize: deps.pageSize ?? 20 } }),
      listCategoryOptionsFn(),
    ]);
    return { articles, categories };
  },
  component: ArticlesContent,
});
