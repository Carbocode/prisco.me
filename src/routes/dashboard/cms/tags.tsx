/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";

import { TagsPage } from "@/features/cms/pages/tags-page";
import { listCategoriesFn } from "@/features/cms/server/category.functions";
import { listTagsFn } from "@/features/cms/server/tag.functions";

export const Route = createFileRoute("/dashboard/cms/tags")({
  loader: async () => {
    const [tags, categories] = await Promise.all([listTagsFn(), listCategoriesFn()]);
    return { tags, categories };
  },
  component: TagsPage,
});
