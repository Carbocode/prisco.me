import { createFileRoute } from "@tanstack/react-router";

import { PrivacyPage } from "@/features/privacy/pages/privacy-page";
import { pageHead } from "@/features/site/seo/page-head";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: "Privacy | Prisco.me",
      description: "Informativa completa sul trattamento dei dati personali.",
      socialDescription: "Spazio personale di Vincenzo Prisco.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});
