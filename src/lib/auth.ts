import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { oauthProvider } from "@better-auth/oauth-provider";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { admin, captcha, jwt, twoFactor, username } from "better-auth/plugins";

import { getDb } from "@/db";
import * as schema from "@/db/schema";
import { cmsAccessControl, cmsRoles } from "@/lib/cms-permissions";

type AuthEnv = Env & {
  BETTER_AUTH_SECRET: string;
  TURNSTILE_SECRET?: string;
  CF_TS_KEY?: string;
};

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
    rateLimit: {
      enabled: true,
      window: 300,
      max: 100,
      storage: "database",
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-in/username": { window: 60, max: 5 },
        "/sign-up/email": { window: 300, max: 3 },
      },
    },
    advanced: {
      database: { generateId: () => crypto.randomUUID() },
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"], ipv6Subnet: 64 },
      useSecureCookies: process.env.NODE_ENV === "production",
    },
    plugins: [
      captcha({
        provider: "cloudflare-turnstile",
        secretKey: env.TURNSTILE_SECRET ?? env.CF_TS_KEY ?? "",
        endpoints: ["/sign-in/email", "/sign-in/username", "/sign-up/email"],
        expectedAction: "turnstile-spin-v2",
        allowedHostnames: ["prisco.me", "localhost", "127.0.0.1"],
      }),
      admin({ defaultRole: "user", adminRoles: ["admin"], ac: cmsAccessControl, roles: cmsRoles }),
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
