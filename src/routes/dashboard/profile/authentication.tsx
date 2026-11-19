import { createFileRoute } from "@tanstack/react-router";

import { AuthenticationPage } from "@/features/account/pages/authentication-page";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/dashboard/profile/authentication")({
  head: ({
    match: {
      context: { locale },
    },
  }) => ({ meta: [{ title: m.security_seo({}, { locale }) }] }),
  component: AuthenticationPage,
});
