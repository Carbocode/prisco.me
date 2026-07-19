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

## Turnstile e protezione anti-bot

I flussi password usano il widget Cloudflare Turnstile `Prisco Website` in modalita
Managed. La verifica e obbligatoria per login email, login username e registrazione;
il login con passkey resta escluso.

La sitekey pubblica e configurata come `TURNSTILE_SITE_KEY` in `wrangler.json`. Il
secret deve esistere solo nello secret store del Worker:

```sh
bunx wrangler secret put TURNSTILE_SECRET
```

Il widget autorizza `prisco.me`, `localhost` e `127.0.0.1`. Il client invia il token
nell'header `x-captcha-response`; il plugin CAPTCHA di Better Auth lo verifica
server-side controllando anche hostname e action `turnstile-spin-v2`.

Per lo sviluppo locale crea `.dev.vars` (ignorato da Git) usando le chiavi di test
ufficiali Cloudflare, che accettano sempre la verifica:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-high-entropy-secret
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET=1x0000000000000000000000000000000AA
```

Non usare le chiavi di test in produzione.

### Rate limiting

Better Auth salva i contatori in D1. Applica la migrazione `0027_add_auth_rate_limit`
prima di distribuire il codice:

```sh
bun run db:migrate
bun run db:migrate:remote
```

Le soglie applicative sono 5 tentativi al minuto per i login email/username e 3
registrazioni ogni 5 minuti, per IP.

Nel pannello Cloudflare crea inoltre una regola WAF Rate Limiting con espressione:

```text
http.request.uri.path in {
  "/api/auth/sign-in/email"
  "/api/auth/sign-in/username"
  "/api/auth/sign-up/email"
}
```

Configurala per IP sorgente, 10 richieste ogni 10 secondi, azione Block e durata
10 secondi. Se il piano lo consente, escludi i bot verificati. Questa regola ferma
i burst prima che raggiungano il Worker; il limite Better Auth resta la protezione
persistente piu restrittiva.

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
