import { createFileRoute } from "@tanstack/react-router";

import { AuthorizationsPage } from "@/features/account/pages/authorizations-page";

export const Route = createFileRoute("/dashboard/profile/authorizations")({
  head: () => ({ meta: [{ title: "Autorizzazioni | Prisco.me" }] }),
  component: AuthorizationsPage,
});
