# Better Auth setup

Authentication uses Better Auth on Cloudflare Workers, Drizzle, and D1. Enabled plugins are Admin, Username, Two Factor, Passkey, and OAuth 2.1 Provider.

## Secret

For development, create `.dev.vars` (ignored by Git) with a random secret of at least 32 characters:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-high-entropy-secret
```

In production, register the same binding as a Cloudflare secret:

```sh
bunx wrangler secret put BETTER_AUTH_SECRET
```

Do not put the secret in `wrangler.json` or the repository.

## Turnstile and bot protection

Password flows use the Cloudflare Turnstile `Prisco Website` widget in Managed mode. Verification is mandatory for email login, username login, and registration; passkey login is excluded.

The public site key is configured as `TURNSTILE_SITE_KEY` in `wrangler.json`. The secret must exist only in the Worker's secret store:

```sh
bunx wrangler secret put TURNSTILE_SECRET
```

The widget allows `prisco.me`, `localhost`, and `127.0.0.1`. The client sends the token in the `x-captcha-response` header; Better Auth's CAPTCHA plugin verifies it server-side, including the hostname and `turnstile-spin-v2` action.

For local development, create `.dev.vars` (ignored by Git) using the official Cloudflare test keys, which always pass verification:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-high-entropy-secret
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET=1x0000000000000000000000000000000AA
```

Do not use test keys in production.

### Rate limiting

Better Auth stores counters in D1. Apply migration `0027_add_auth_rate_limit` before deploying the code:

```sh
bun run db:migrate
bun run db:migrate:remote
```

Application limits are 5 attempts per minute for email/username login and 3 registrations every 5 minutes, per IP.

In the Cloudflare dashboard, also create a WAF Rate Limiting rule with this expression:

```text
http.request.uri.path in {
  "/api/auth/sign-in/email"
  "/api/auth/sign-in/username"
  "/api/auth/sign-up/email"
}
```

Configure it by source IP: 10 requests per 10 seconds, Block action, 10-second duration. Exclude verified bots if the plan supports it. This rule stops bursts before they reach the Worker; Better Auth remains the stricter persistent protection.

## Database

Apply `drizzle/0003_lame_leopardon.sql` locally, then in production:

```sh
bun run db:migrate
bun run db:migrate:remote
```

## First administrator

New registrations receive the `user` role. After creating the first administrator's account, run this once:

```sql
UPDATE user SET role = 'admin' WHERE email = 'admin@example.com';
```

Administrators can then assign or remove the Admin role for other users in `/dashboard/admin/users`.

## OAuth Provider

Default issuer: `https://prisco.me/api/auth`. Public and local hosts are restricted by the `baseURL` allowlist in `src/features/auth/server/auth.ts`. Login and consent pages are `/login` and `/oauth/consent`; OAuth/OIDC discovery and JWKS are served by the Better Auth handler. Clients and consents are managed from the profile.
