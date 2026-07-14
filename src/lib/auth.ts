import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { oauthProvider } from "@better-auth/oauth-provider";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { admin, jwt, twoFactor, username } from "better-auth/plugins";

import { getDb } from "@/db";
import * as schema from "@/db/schema";

type AuthEnv = Env & { BETTER_AUTH_SECRET: string };

export function createAuth(env: AuthEnv) {
  return betterAuth({
    appName: "Prisco.me",
    baseURL: {
      allowedHosts: [
        "prisco.me",
        "www.prisco.me",
        "localhost:3000",
        "localhost:4173",
        "localhost:5173",
      ],
      fallback: "https://prisco.me",
      protocol: "auto",
    },
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(env), { provider: "sqlite", schema }),
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    user: { changeEmail: { enabled: true }, deleteUser: { enabled: true } },
    trustedOrigins: ["https://prisco.me", "http://localhost:3000", "http://localhost:5173"],
    advanced: {
      database: { generateId: () => crypto.randomUUID() },
      useSecureCookies: process.env.NODE_ENV === "production",
    },
    plugins: [
      admin({ defaultRole: "user" }),
      username(),
      twoFactor({ issuer: "Prisco.me" }),
      passkey({ rpName: "Prisco.me" }),
      jwt(),
      oauthProvider({
        loginPage: "/login",
        consentPage: "/oauth/consent",
        allowDynamicClientRegistration: true,
      }),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
