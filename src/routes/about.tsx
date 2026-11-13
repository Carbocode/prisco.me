import { createFileRoute } from "@tanstack/react-router";

import { SiteInformationPage } from "@/features/site/pages/about-page";
import { pageHead } from "@/features/site/seo/page-head";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "Informazioni sul sito | Prisco.me",
      description: "Tecnologie, strumenti e repository del sito personale di Vincenzo Prisco.",
      socialDescription: "Scopri come è costruito Prisco.me",
      path: "/about",
    }),
  component: SiteInformationPage,
});
