import { createFileRoute } from "@tanstack/react-router";

import { CookiePage } from "@/features/privacy/pages/cookie-page";
import { pageHead } from "@/features/site/seo/page-head";

export const Route = createFileRoute("/cookie")({
  head: () =>
    pageHead({
      title: "Cookie | Prisco.me",
      description:
        "Informativa completa sui cookie e sugli strumenti di tracciamento utilizzati da Prisco.me",
      socialDescription:
        "Categorie, finalità, consenso e gestione degli strumenti di tracciamento.",
      path: "/cookie",
    }),
  component: CookiePage,
});
