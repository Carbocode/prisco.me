import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const getTurnstileSiteKey = createServerFn({ method: "GET" }).handler(() =>
  Promise.resolve(env.TURNSTILE_SITE_KEY),
);
