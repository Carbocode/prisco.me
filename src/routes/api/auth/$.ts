import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

import { createAuth, isLocalRequest } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) =>
        createAuth(env, { captchaEnabled: !isLocalRequest(request) }).handler(request),
      POST: ({ request }) =>
        createAuth(env, { captchaEnabled: !isLocalRequest(request) }).handler(request),
    },
  },
});
