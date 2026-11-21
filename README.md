# prisco.me

Personal website and CMS built with React, TanStack Start, shadcn, and Cloudflare Workers, D1, and R2. The project uses Bun.

## Development

```sh
bun run setup:worktree
bun run dev
```

Create a branch and worktree from the current remote main branch for each change:

```sh
git fetch origin main
git worktree add -b feat/example ../prisco-example origin/main
cd ../prisco-example
bun run setup:worktree
bun run dev
```

Setup installs from the lockfile, copies missing local environment files from the primary checkout, and applies migrations to this checkout’s own local D1 state. Existing local files and state are preserved on reruns. `bun run dev:wrangler` builds and starts the application with the same local D1 state. Push the feature branch and open a pull request into `main`; require the **Verify** check in the GitHub branch ruleset before merging.

`bun run dev` compiles Paraglide before starting Vite so dependency scanning can resolve generated message imports on a fresh checkout. Vite and Vitest both use physical message modules to keep generated imports consistent across development, tests, and CLI compilation.

## Structure

- `src/app/`: document shell and query client integration.
- `src/routes/`: TanStack Start routes, loaders, authorization, and metadata.
- `src/features/`: pages, components, models, and server operations organized by feature.
- `src/components/`: shared components, shadcn primitives, layout, artwork, media, and tables.
- `src/config/`, `src/lib/`, `src/hooks/`: cross-feature configuration and utilities.
- `src/db/`: database schema and infrastructure.
- `src/styles/`: global styles divided by responsibility; entrypoint in `src/styles.css`.
- `public/`: public assets, including SVG sources and WebP caches.
- `scripts/`: development, asset, and maintenance tools.

The [agent instructions](AGENTS.md) enforce boundaries and conventions for changes. The [architecture guide](docs/architecture.md) describes feature ownership and module separation. Home also has a [dedicated guide](src/features/home/README.md).

Technical documentation and AI discovery resources are written in English. Public editorial content and interface copy retain their intended language.

## Validation

```sh
bun run ci
```

Runs asset validation, formatting, lint, TypeScript, tests, migration checks, and the build. Tests live beside the modules they verify.

When an SVG registered in `scripts/static-artwork.json` changes, run `bun run assets:render`; `bun run assets:check` verifies that caches are current.

## Test and production delivery

[CI and deploy](.github/workflows/ci.yml) validates pull requests using a fresh local D1 database. A push to `main` deploys the checked commit to [test.prisco.me](https://test.prisco.me). The test Worker uses `prisco-website-test` in D1, a separate R2 bucket and Turnstile widget, and test-only authentication secrets. It applies the same migrations as production and loads [sample CMS records](scripts/seed-test.sql) without copying production data. Test pages instruct crawlers to stay out.

To release, wait for **Deploy test** to pass for the commit you tested. Publish a GitHub release with a `v*` tag pointing to that exact commit, for example `v1.0.0`. GitHub checks that the tagged commit passed the test deployment before applying migrations and publishing it to [prisco.me](https://prisco.me). Drafts and prereleases do not publish to production. Both environments check the Italian and English home pages after deployment.

The GitHub `test` environment allows the `main` branch, and `production` allows `v*` tags. Each environment needs a `CLOUDFLARE_API_TOKEN` secret with Worker deployment and D1 migration permissions, and a `CLOUDFLARE_ACCOUNT_ID` variable. Production also carries its analytics build variables (`VITE_MODE`, `VITE_FARO_URL`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_KEY`, where configured). Keep Cloudflare Workers Builds disconnected so GitHub is the only automatic publisher.

Keep new migrations compatible with the currently deployed Worker. Split breaking schema changes across releases so the old Worker can still serve requests between migration and publication, and so a failed Worker release can be retried. Keep applied SQL files immutable and rebase feature branches with pending migrations before merging.

For incident recovery, first check pending migrations using authenticated Wrangler:

```sh
bunx wrangler d1 migrations list prisco-website --remote
```

If the deployed Worker is waiting for a pending migration, run `bun run db:migrate:remote` from the deployed commit, then check the affected URLs. Under normal operation, rerun the failed GitHub test deployment or release workflow. `bun run deploy:dry` builds and checks the Worker without touching remote data.
