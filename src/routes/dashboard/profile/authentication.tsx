import { createFileRoute } from "@tanstack/react-router";

import { AuthenticationPage } from "@/features/account/pages/authentication-page";

export const Route = createFileRoute("/dashboard/profile/authentication")({
  head: () => ({ meta: [{ title: "Autenticazione | Prisco.me" }] }),
  component: AuthenticationPage,
});
