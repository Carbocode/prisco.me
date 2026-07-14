# Better Auth setup

L'autenticazione usa Better Auth su Cloudflare Workers, Drizzle e D1. Sono attivi i plugin Admin, Username, Two Factor, Passkey e OAuth 2.1 Provider.

## Secret

In sviluppo crea `.dev.vars` (ignorato da Git) con un segreto casuale di almeno 32 caratteri:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-high-entropy-secret
```

In produzione registra lo stesso binding come secret Cloudflare:

```sh
bunx wrangler secret put BETTER_AUTH_SECRET
```

Non inserire il secret in `wrangler.json` o nel repository.

## Database

Applica `drizzle/0003_lame_leopardon.sql` in locale e poi in produzione:

```sh
bun run db:migrate
bun run db:migrate:remote
```

## Primo amministratore

Ogni registrazione nasce con ruolo `user`. Per inizializzare il primo amministratore, dopo aver creato il suo account esegui una sola volta:

```sql
UPDATE user SET role = 'admin' WHERE email = 'admin@example.com';
```

Da quel momento l'area `/admin` permette agli amministratori di assegnare o rimuovere il ruolo Admin agli altri utenti.

## OAuth Provider

Issuer predefinito: `https://prisco.me/api/auth`. Gli host pubblici e locali sono limitati dalla allowlist `baseURL` in `src/lib/auth.ts`. Le pagine di login e consenso sono `/login` e `/oauth/consent`; discovery OAuth/OIDC e JWKS sono serviti dall'handler Better Auth. I client e i consensi si gestiscono dal profilo.
