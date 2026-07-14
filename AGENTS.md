# Regole per l'interfaccia

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
