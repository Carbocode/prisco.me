# prisco.me

Personal website and CMS built with React, TanStack Start, shadcn, and Cloudflare Workers, D1, and R2. The project uses Bun.

## Development

```sh
bun install
bun run dev
```

`bun run setup:worktree` prepares a worktree's local environment. `bun run dev:wrangler` builds and starts the application with the local Cloudflare runtime.

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
