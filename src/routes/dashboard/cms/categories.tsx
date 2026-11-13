import { createFileRoute } from "@tanstack/react-router";

import { listSearchSchema } from "@/features/cms/domain/list-search";
import { CategoriesContent } from "@/features/cms/pages/categories-page";
import { listCategoriesPageFn } from "@/features/cms/server/category.functions";
export const Route = createFileRoute("/dashboard/cms/categories")({
  validateSearch: listSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => ({ result: await listCategoriesPageFn({ data: deps }) }),
  component: CategoriesContent,
});
