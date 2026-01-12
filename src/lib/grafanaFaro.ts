import {
  getWebInstrumentations,
  initializeFaro,
  ReactIntegration,
} from "@grafana/faro-react";
import { VolatileSessionsManager } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { createIsomorphicFn } from "@tanstack/react-start";

export const initFaro = createIsomorphicFn().client(() => {
  initializeFaro({
    url: import.meta.env.VITE_FARO_URL,
    app: {
      name: "prisco-website",
      version: "1.0.0",
      environment: import.meta.env.VITE_MODE,
    },
    instrumentations: [
      ...getWebInstrumentations(),

      new TracingInstrumentation({
        resourceAttributes: {
          session_id: VolatileSessionsManager.fetchUserSession()?.sessionId,
        },
        instrumentationOptions: {
          propagateTraceHeaderCorsUrls: [window.location.origin],
        },
      }),
      new ReactIntegration(),
    ],
    consoleInstrumentation: {
      consoleErrorAsLog: true,
    },
  });
});
