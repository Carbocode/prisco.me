import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { env as cloudflareEnv } from "cloudflare:workers";

import { SITE } from "@/config/site";
import { createAuth, isLocalRequest } from "@/features/auth/server/auth";
import { ardPath } from "@/features/site/domain/ard";
import { serveSiteByLanguage } from "@/features/site/server/site-language";

export default createServerEntry({
  async fetch(request: Request) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      // Site discovery is served by its route; preserve Better Auth's other well-known endpoints.
      if (path.startsWith("/.well-known/") && path !== ardPath) {
        return createAuth(cloudflareEnv, {
          captchaEnabled: !isLocalRequest(request),
        }).handler(request);
      }
      if (url.origin !== SITE.testOrigin) {
        return serveSiteByLanguage(request, url, () => handler.fetch(request));
      }
      if (path === "/robots.txt") {
        return new Response("User-agent: *\nDisallow: /\n", {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
      const response = await serveSiteByLanguage(request, url, () => handler.fetch(request));
      const headers = new Headers(response.headers);
      headers.set("X-Robots-Tag", "noindex, nofollow");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
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
