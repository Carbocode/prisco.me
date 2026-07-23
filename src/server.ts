import * as Sentry from "@sentry/cloudflare";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { env as cloudflareEnv } from "cloudflare:workers";

import { createAuth, isLocalRequest } from "@/lib/auth";

export default createServerEntry(
  Sentry.withSentry(
    (env: Env) => ({
      dsn: env.SENTRY_DNS,
      version: env.CF_VERSION_METADATA,
      integrations: [Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] })],
      sendDefaultPii: true,
      enableLogs: true,
      tracesSampleRate: 1.0,
    }),
    {
      async fetch(request: Request) {
        if (new URL(request.url).pathname.startsWith("/.well-known/")) {
          return createAuth(cloudflareEnv, {
            captchaEnabled: !isLocalRequest(request),
          }).handler(request);
        }
        return handler.fetch(request);
      },
    },
  ),
);
