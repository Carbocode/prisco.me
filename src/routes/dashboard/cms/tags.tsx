import { createFileRoute } from "@tanstack/react-router";

import { listSearchSchema } from "@/features/cms/domain/list-search";
import { TagsPage } from "@/features/cms/pages/tags-page";
import { listCategoryOptionsFn } from "@/features/cms/server/category.functions";
import { listTagsPageFn } from "@/features/cms/server/tag.functions";
export const Route = createFileRoute("/dashboard/cms/tags")({
  validateSearch: listSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [result, categories] = await Promise.all([
      listTagsPageFn({ data: deps }),
      listCategoryOptionsFn(),
    ]);
    return { result, categories };
  },
  component: TagsPage,
});
