/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";

import { CategoriesContent } from "@/features/cms/pages/categories-page";
import { listCategoriesFn } from "@/features/cms/server/category.functions";
import { listMediaFn } from "@/features/cms/server/media.functions";

export const Route = createFileRoute("/dashboard/cms/categories")({
  loader: async () => {
    const [categories, media] = await Promise.all([listCategoriesFn(), listMediaFn()]);
    return { categories, media };
  },
  component: CategoriesContent,
});
