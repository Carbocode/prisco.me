import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { listPublishedArticlesFn } from "@/features/cms/server/public.functions";
import { homeHead } from "@/features/home/home-head";
import { HomePage } from "@/features/home/home-page";
import type { HomeArticle } from "@/features/home/home.types";
import { getPortfolioQueryOptions } from "@/features/portfolio/server/portfolio.functions";
import { useSiteLocale } from "@/features/site/client/site-location";

export const Route = createFileRoute("/")({
  loader: async ({ context }): Promise<{ articles: HomeArticle[] }> => {
    const [, articles] = await Promise.all([
      context.queryClient.ensureQueryData(getPortfolioQueryOptions()),
      listPublishedArticlesFn({ data: { limit: 1, categorySlug: "blog" } }),
    ]);
    return { articles };
  },
  head: ({ match }) => homeHead(match.context.locale),
  component: HomeRoute,
});

function HomeRoute() {
  const { data: portfolio } = useSuspenseQuery(getPortfolioQueryOptions());
  const { articles } = Route.useLoaderData();
  const locale = useSiteLocale();
  return <HomePage locale={locale} projects={portfolio.projects.slice(0, 2)} articles={articles} />;
}
