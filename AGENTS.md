# Regole per l'interfaccia

## Illustrazioni SVG statiche e cache WebP

- Per le illustrazioni statiche complesse o con filtri, preferire un WebP prerenderizzato lossless, uguale su tutti i browser. Conservare sempre lo SVG originale come sorgente modificabile.
- Le trasformazioni e animazioni CSS dell'intera immagine (parallasse, rotazione, opacità) sono compatibili con il prerender. Mantenere SVG per animazioni della geometria interna, elementi interattivi, icone e loghi che beneficiano del formato vettoriale.
- Il manifest `scripts/static-artwork.json` elenca sorgenti, risoluzioni e hash dei WebP generati. Aggiungere le nuove illustrazioni idonee al manifest e usare il corrispondente `.webp` nei componenti e negli sfondi CSS.
- Quando si modifica uno SVG nel manifest, rigenerare autonomamente il relativo WebP con `bun run assets:render`, senza attendere una richiesta dell'utente. Il comando aggiorna solo asset mancanti o cambiati e non richiede un server del sito.
- Se manca il browser di rendering, installarlo con `bunx playwright install firefox`, poi ripetere il comando.
- Eseguire `bun run assets:check` prima di completare il lavoro: verifica gli hash delle sorgenti, delle impostazioni e degli output. Il controllo è incluso in `bun run check` e quindi nella CI.
- Non eliminare effetti per risolvere problemi di performance e non introdurre versioni grafiche diverse per Firefox. Dopo una modifica alle illustrazioni verificare trasparenza, risoluzione e conservazione degli effetti.

## Sezioni funzionali

Tutte le sezioni funzionali dell'applicazione devono utilizzare obbligatoriamente i componenti shadcn disponibili nel progetto. Questa regola si applica, tra le altre, a form, selettori, liste e tabelle.

In queste sezioni:

- utilizzare direttamente i componenti shadcn appropriati;
- non racchiudere i componenti shadcn in wrapper custom;
- non sovrascrivere, estendere o personalizzare lo stile dei componenti shadcn;
- non ricreare con HTML o componenti custom un elemento già disponibile come componente shadcn.

Sono escluse da questa regola esclusivamente le sezioni di tipo landing page, hero e showcase, per le quali è consentita una composizione visiva personalizzata.

# Regole TanStack Start

## GEO e structured data

Per Generative Engine Optimization (GEO) seguire la guida ufficiale TanStack Start:
https://tanstack.com/start/latest/docs/framework/react/guide/geo

- inserire i dati strutturati JSON-LD tramite `head()` della route, usando la proprieta `scripts`;
- usare `children: JSON.stringify(...)` negli oggetti di `scripts`;
- non inserire tag `<script type="application/ld+json">` direttamente nei componenti React o nel document shell;
- non usare `dangerouslySetInnerHTML` per JSON-LD;
- se il JSON-LD dipende da dati dinamici, caricare quei dati nel `loader` della route e leggerli da `loaderData` dentro `head()`;
- usare vocabolario `schema.org` coerente con il contenuto: `WebSite` e `Person` nella root, `Article` per articoli, `CreativeWork` per progetti, `ContactPage` per la pagina contatti, `FAQPage` per FAQ;
- mantenere anche meta tag tradizionali, canonical URL e Open Graph nel `head()`;
- strutturare i contenuti con affermazioni chiare, gerarchia di heading corretta e attribuzione autore quando utile;
- valutare endpoint machine-readable o `llms.txt` solo quando aggiungono informazioni realmente mantenibili.

Per `llms.txt`, seguire la sezione dedicata della guida TanStack Start:
https://tanstack.com/start/latest/docs/framework/react/guide/geo#llms-txt

- creare la route come `src/routes/llms[.]txt.ts`;
- esporre il path pubblico `/llms.txt`;
- usare una server route con `server.handlers.GET`;
- restituire `new Response(content, { headers: { "Content-Type": "text/plain" } })`;
- mantenere il contenuto breve, fattuale e aggiornabile: descrizione del sito, pagine principali, fatti chiave e contatto;
- non includere segreti, dati personali non pubblici, contenuti promozionali fragili o informazioni che richiedono aggiornamenti manuali frequenti.

Per `ContactPage`, seguire anche questa reference:
https://www.karpi.studio/schema-glossary-types/contact-page

- usare almeno `name`, `description`, `url`, `mainEntity`, `isPartOf` e `inLanguage`;
- collegare `mainEntity` all'entita principale del sito (`Person` per questo progetto personale, `Organization` solo se il contesto cambia);
- collegare `isPartOf` al `WebSite` root;
- preferire riferimenti `@id` stabili, ad esempio `https://prisco.me/#person` e `https://prisco.me/#website`.
