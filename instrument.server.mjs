import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
  dsn: "https://5612ec342f3bba5f99d97f79453e2ddd@o4510675457540096.ingest.de.sentry.io/4510675466125392",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});