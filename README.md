# prisco.me

Sito personale e CMS, realizzati con React, TanStack Start, shadcn e Cloudflare Workers, D1 e R2. Il progetto usa Bun.

## Sviluppo

```sh
bun install
bun run dev
```

`bun run setup:worktree` prepara l'ambiente locale di un worktree. `bun run dev:wrangler` compila e avvia l'applicazione con il runtime Cloudflare locale.

## Struttura

- `src/app/`: document shell e integrazione del query client.
- `src/routes/`: route TanStack Start, loader, autorizzazione e metadati.
- `src/features/`: pagine, componenti, modelli e operazioni server organizzati per funzionalità.
- `src/components/`: componenti condivisi, primitive shadcn, layout, illustrazioni, media e tabelle.
- `src/config/`, `src/lib/`, `src/hooks/`: configurazione e utilità trasversali.
- `src/db/`: schema e accesso al database.
- `src/styles/`: stili globali divisi per responsabilità; ingresso in `src/styles.css`.
- `public/`: asset pubblici, compresi sorgenti SVG e cache WebP.
- `scripts/`: strumenti per sviluppo, asset e manutenzione.

Le [istruzioni per gli agenti](AGENTS.md) impongono i confini e le convenzioni da rispettare nelle modifiche. La [guida all'architettura](docs/architecture.md) descrive le responsabilità delle feature e la separazione dei moduli. La home ha anche una [guida dedicata](src/features/home/README.md).

## Verifica

```sh
bun run ci
```

Esegue controllo degli asset, formattazione, lint, TypeScript, test, verifica delle migrazioni e build. I test sono accanto ai moduli che verificano.

Quando cambia uno SVG registrato in `scripts/static-artwork.json`, eseguire `bun run assets:render`; `bun run assets:check` verifica che le cache siano aggiornate.
