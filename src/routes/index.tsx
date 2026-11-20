import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { homeHead } from "@/features/home/home-head";
import { HomePage } from "@/features/home/home-page";
import { getHomeFeaturedFn } from "@/features/home/server/home.functions";
import { useSiteLocale } from "@/features/site/client/site-location";

const routeApi = getRouteApi("/");

export const Route = createFileRoute("/")({
  loader: () => getHomeFeaturedFn(),
  head: ({ match }) => homeHead(match.context.locale),
  component: HomeRoute,
});

function HomeRoute() {
  const { articles, projects } = routeApi.useLoaderData();
  const locale = useSiteLocale();
  return <HomePage locale={locale} projects={projects} articles={articles} />;
}
