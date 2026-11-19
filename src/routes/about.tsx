import { createFileRoute } from "@tanstack/react-router";

import { SiteInformationPage } from "@/features/site/pages/about-page";
import { localizedPageHead } from "@/features/site/seo/page-head";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/about")({
  head: ({
    match: {
      context: { locale },
    },
  }) =>
    localizedPageHead(locale, {
      title: m.about_seo_title({}, { locale }),
      description: m.about_seo_description({}, { locale }),
      socialDescription: m.about_seo_social({}, { locale }),
      path: "/about",
    }),
  component: SiteInformationPage,
});
