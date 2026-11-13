import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/mini";

import { AccessPage } from "@/features/auth/pages/login-page";
import { getTurnstileSiteKey } from "@/features/auth/server/turnstile.functions";

const searchSchema = z.object({
  mode: z.catch(z.enum(["login", "register"]), "login"),
  callbackURL: z.optional(z.string().check(z.startsWith("/"))),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  loader: () => getTurnstileSiteKey(),
  head: () => ({
    meta: [{ title: "Accedi o registrati | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: AccessPage,
});
