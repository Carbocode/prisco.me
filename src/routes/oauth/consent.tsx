import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/mini";

import { ConsentRoute } from "@/features/auth/pages/oauth-consent-page";

const consentSearch = z.object({
  client_id: z.catch(z.string(), "Applicazione OAuth"),
  scope: z.catch(z.string(), "openid profile email"),
});

export const Route = createFileRoute("/oauth/consent")({
  validateSearch: consentSearch,
  head: () => ({
    meta: [{ title: "Autorizza applicazione | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: ConsentRoute,
});
