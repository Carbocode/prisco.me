import { createFileRoute } from "@tanstack/react-router";

import { PrivacyPage } from "@/features/privacy/pages/privacy-page";
import { localizedPageHead } from "@/features/site/seo/page-head";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/privacy")({
  head: ({
    match: {
      context: { locale },
    },
  }) =>
    localizedPageHead(locale, {
      title: m.privacy_seo_title({}, { locale }),
      description: m.privacy_seo_description({}, { locale }),
      socialDescription: m.privacy_seo_social({}, { locale }),
      path: "/privacy",
    }),
  component: PrivacyPage,
});
