/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";

import { CmsDashboardContent } from "@/features/cms/pages/cms-dashboard-page";
import { articleStatsFn, listArticlesFn } from "@/features/cms/server/article.functions";
import { listTaxonomyTrashFn } from "@/features/cms/server/trash.functions";

export const Route = createFileRoute("/dashboard/cms/")({
  loader: async () => {
    const articles = await listArticlesFn({ data: { page: 1, pageSize: 8 } });
    return {
      articles: articles.items,
      stats: await articleStatsFn(),
      trash: await listTaxonomyTrashFn(),
    };
  },
  component: CmsDashboardContent,
});
