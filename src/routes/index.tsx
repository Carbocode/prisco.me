import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { listPublishedArticlesFn } from "@/features/cms/server/public.functions";
import { HomePage } from "@/features/home/home-page";
import { pageHead } from "@/lib/page-head";
import { getPortfolioQueryOptions } from "@/server/portfolio";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Vincenzo Prisco | Software Engineer",
      description: "Spazio personale di Vincenzo Prisco.",
      path: "/",
    }),
  loader: async ({ context }) => {
    const [, articles] = await Promise.all([
      context.queryClient.ensureQueryData(getPortfolioQueryOptions()),
      listPublishedArticlesFn({ data: { limit: 1, categorySlug: "blog" } }),
    ]);
    return { articles };
  },
  component: HomeRoute,
});

function HomeRoute() {
  const { data: portfolio } = useSuspenseQuery(getPortfolioQueryOptions());
  const { articles } = Route.useLoaderData();
  return (
    <HomePage
      projects={portfolio.projects.slice(0, 2)}
      experiences={[...portfolio.experiences].sort((a, b) =>
        a.startDate.localeCompare(b.startDate),
      )}
      articles={articles}
    />
  );
}
