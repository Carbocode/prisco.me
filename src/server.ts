import * as Sentry from "@sentry/cloudflare";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry(
  Sentry.withSentry(
    (env: Env) => ({
      dsn: env.SENTRY_DNS,
      version: env.CF_VERSION_METADATA,
      integrations: [
        Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
      ],
      sendDefaultPii: true,
      enableLogs: true,
      tracesSampleRate: 1.0,
    }),
    {
      async fetch(request: Request) {
        return handler.fetch(request);
      },
    },
  ),
);
