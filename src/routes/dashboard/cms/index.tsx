/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";

import { CmsDashboardContent } from "@/features/cms/pages/cms-dashboard-page";
import { articleStatsFn, listArticlesFn } from "@/features/cms/server/article.functions";

export const Route = createFileRoute("/dashboard/cms/")({
  loader: async () => {
    const [articles, stats] = await Promise.all([
      listArticlesFn({ data: { page: 1, pageSize: 8 } }),
      articleStatsFn(),
    ]);
    return { articles: articles.items, stats };
  },
  component: CmsDashboardContent,
});
