import { createFileRoute } from "@tanstack/react-router";

import { CareerPage } from "@/features/career/pages/career-page";
import { getPortfolioQueryOptions } from "@/features/portfolio/server/portfolio.functions";
import { pageHead } from "@/features/site/seo/page-head";

export const Route = createFileRoute("/career")({
  head: () =>
    pageHead({
      title: "Carriera | Vincenzo Prisco",
      description: "Il percorso formativo e professionale di Vincenzo Prisco",
      path: "/career",
    }),
  loader: ({ context }) => context.queryClient.ensureQueryData(getPortfolioQueryOptions()),
  component: CareerPage,
});
