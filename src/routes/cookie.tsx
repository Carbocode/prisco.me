import { createFileRoute } from "@tanstack/react-router";

import { CookiePage } from "@/features/privacy/pages/cookie-page";
import { localizedPageHead } from "@/features/site/seo/page-head";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/cookie")({
  head: ({
    match: {
      context: { locale },
    },
  }) =>
    localizedPageHead(locale, {
      title: m.cookie_seo_title({}, { locale }),
      description: m.cookie_seo_description({}, { locale }),
      socialDescription: m.cookie_seo_social({}, { locale }),
      path: "/cookie",
    }),
  component: CookiePage,
});
