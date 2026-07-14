import * as Sentry from "@sentry/tanstackstart-react";

type SentryRouter = Parameters<typeof Sentry.tanstackRouterBrowserTracingIntegration>[0];

export function initSentry(router: SentryRouter) {
  Sentry.init({
    dsn: "https://1b376c7d10b15705ff1a40c2f8f140cb@o4510675457540096.ingest.de.sentry.io/4510702232862800",
    sendDefaultPii: true,
    integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
    enableLogs: true,
    tracesSampleRate: 1.0,
  });
}
