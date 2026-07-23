import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";

import { isLocalHostname } from "@/lib/auth";

export const getTurnstileSiteKey = createServerFn({ method: "GET" }).handler(() => {
  const host = getRequestHeaders().get("host");
  const hostname = host ? new URL(`http://${host}`).hostname : "";

  return Promise.resolve(isLocalHostname(hostname) ? null : env.TURNSTILE_SITE_KEY);
});
