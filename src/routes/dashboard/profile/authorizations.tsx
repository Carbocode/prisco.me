import { createFileRoute } from "@tanstack/react-router";

import { AuthorizationsPage } from "@/features/account/pages/authorizations-page";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/dashboard/profile/authorizations")({
  head: ({
    match: {
      context: { locale },
    },
  }) => ({ meta: [{ title: m.authorizations_seo({}, { locale }) }] }),
  component: AuthorizationsPage,
});
