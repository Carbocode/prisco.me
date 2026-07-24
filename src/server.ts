import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { env as cloudflareEnv } from "cloudflare:workers";

import { createAuth, isLocalRequest } from "@/lib/auth";

export default createServerEntry({
  async fetch(request: Request) {
    try {
      if (new URL(request.url).pathname.startsWith("/.well-known/")) {
        return createAuth(cloudflareEnv, {
          captchaEnabled: !isLocalRequest(request),
        }).handler(request);
      }
      return handler.fetch(request);
    } catch (error) {
      console.error("Errore non gestito durante la richiesta", {
        action: "request_unhandled_error",
        method: request.method,
        path: new URL(request.url).pathname,
        ...errorDetails(error),
      });
      throw error;
    }
  },
});

function errorDetails(error: unknown) {
  if (error instanceof Error) {
    return { errorName: error.name, errorMessage: error.message, errorStack: error.stack };
  }
  return { errorMessage: String(error) };
}
