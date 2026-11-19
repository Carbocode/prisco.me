import { createFileRoute } from "@tanstack/react-router";

import { CareerPage } from "@/features/career/pages/career-page";
import { getPortfolioQueryOptions } from "@/features/portfolio/server/portfolio.functions";
import { localizedPageHead } from "@/features/site/seo/page-head";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/career")({
  head: ({
    match: {
      context: { locale },
    },
  }) =>
    localizedPageHead(locale, {
      title: m.career_seo_title({}, { locale }),
      description: m.career_seo_description({}, { locale }),
      path: "/career",
    }),
  loader: ({ context }) => context.queryClient.ensureQueryData(getPortfolioQueryOptions()),
  component: CareerPage,
});
