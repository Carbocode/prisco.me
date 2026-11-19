import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/mini";

import { ConsentRoute } from "@/features/auth/pages/oauth-consent-page";

const consentSearch = z.object({
  client_id: z.catch(z.string(), "Applicazione OAuth"),
  scope: z.catch(z.string(), "openid profile email"),
});

import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/oauth/consent")({
  validateSearch: consentSearch,
  head: ({
    match: {
      context: { locale },
    },
  }) => ({
    meta: [{ title: m.oauth_seo_title({}, { locale }) }, { name: "robots", content: "noindex" }],
  }),
  component: ConsentRoute,
});
