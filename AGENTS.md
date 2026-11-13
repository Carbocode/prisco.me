# Architettura e organizzazione obbligatorie

Queste regole valgono per tutto il repository e per ogni nuova implementazione o refactoring. Prima di modificare il codice, leggere [docs/architecture.md](docs/architecture.md) e gli eventuali README della feature interessata. Per la home leggere anche [src/features/home/README.md](src/features/home/README.md).

## Collocazione del codice

- Organizzare il codice applicativo per funzionalità in `src/features/<feature>`. Estendere la feature proprietaria esistente prima di crearne una nuova.
- Mantenere pagine in `pages/`, componenti specifici in `components/`, modelli e funzioni pure in `domain/`, operazioni server in `server/`, integrazioni browser in `client/` e stili specifici in `styles/`, quando queste suddivisioni servono. Non creare directory vuote o livelli senza responsabilità concreta.
- Le feature esistenti e le rispettive responsabilità sono elencate in `docs/architecture.md`. In particolare: `cms` gestisce scrittura e amministrazione editoriale, `content` possiede modello dei documenti e lettura pubblica, `editor` possiede l'interfaccia Plate. `auth` gestisce accesso e permessi; `account` gestisce le impostazioni dell'utente; `dashboard` gestisce shell e navigazione dell'area riservata.
- `src/components` ospita soltanto componenti condivisi, organizzati nelle directory `ui`, `layout`, `artwork`, `media` e `data-table`. I componenti usati da una sola feature rimangono nella feature.
- `src/lib` e `src/hooks` ospitano soltanto utilità e hook trasversali. Non spostarvi logica di dominio per comodità e non ricreare contenitori generici come `src/server`, `src/services` o un insieme di componenti applicativi nella radice di `src/components`.
- Identità, URL e impostazioni comuni del sito appartengono a `src/config/site.ts`. Schema e infrastruttura del database appartengono a `src/db`; le query applicative appartengono al server della feature.

## Route e confini tra moduli

- Mantenere `src/routes` dedicato a configurazione TanStack Start: loader, parametri e ricerca, autorizzazione, endpoint, redirect e metadati. Estrarre le viste articolate in `features/<feature>/pages`; nelle route sono ammessi piccoli adattatori di composizione.
- Le pagine estratte devono usare `getRouteApi` quando leggono i dati della route. Non importare il modulo `Route` dalla pagina che quel modulo importa.
- Mantenere documento HTML e provider globali in `src/app`. Conservare gli entrypoint richiesti dal framework nelle posizioni configurate. Non modificare manualmente `src/routeTree.gen.ts`.
- I moduli `domain` devono restare indipendenti da React, route, componenti, hook e runtime server. Usare import di soli tipi quando la dipendenza serve esclusivamente ai tipi.
- I moduli client possono chiamare le server function attraverso `*.functions.ts`. Non devono importare direttamente repository, connessioni D1, accesso R2, segreti o configurazione server dell'autenticazione, nemmeno attraverso riesportazioni.
- Le server function devono mantenere validazione e controlli di accesso sul server; nascondere un controllo nell'interfaccia non costituisce autorizzazione.
- Il renderer pubblico dei contenuti non deve dipendere dall'editor Plate. Modello canonico del documento ed embed condivisi appartengono a `content`; l'editor li riutilizza.
- Le dipendenze tra feature devono puntare al modulo proprietario della capacità o del modello condiviso. Non importare una pagina di un'altra feature per riusarne la logica e non duplicare tipi o validazioni canonici.
- Non introdurre dipendenze circolari. Non aggiungere file di riesportazione che nascondano i confini o mescolino moduli client e server.

## Separazione delle responsabilità

- Separare composizione della vista, gestione dello stato, trasformazioni pure e persistenza quando hanno responsabilità distinte. Non riaccorpare in un solo file i moduli già separati.
- Per il form degli articoli mantenere la separazione tra vista, `use-article-form.ts`, modello, tipi e confronto revisioni. Per l'editor mantenere separati plugin, nodi, dialog, toolbar e dati statici. Per il questionario mantenere il modello del flusso separato dalla vista.
- In `cms/server/articles` mantenere distinti query, mutazioni, pubblicazione, revisioni, idratazione e snapshot. Non ricreare un servizio monolitico degli articoli.
- Per home e career mantenere separati pagina, componenti o sezioni, illustrazioni, animazioni e calcoli puri. Listener, observer e frame devono essere rilasciati allo smontaggio.
- Suddividere per responsabilità, senza soglie arbitrarie di righe né astrazioni speculative. I componenti di composizione non devono diventare wrapper delle primitive shadcn: valgono le regole specifiche sotto.

## Stili, rendering e manutenzione

- Mantenere `src/styles.css` come ingresso globale e preservare l'ordine della cascata dei suoi import. Collocare gli stili delle feature nelle feature; per la home preservare l'ingresso `home.css` e la divisione per scena.
- Per date pubbliche e raggruppamenti per giorno o anno riutilizzare `src/lib/dates.ts` e il fuso definito in `src/config/site.ts`. Non usare il fuso implicito del browser per markup renderizzato anche sul server.
- Non calcolare date correnti destinate al rendering durante l'inizializzazione dei moduli Worker. Mantenere coerente il primo rendering server e client.
- Prima di spostare un modulo, cercarne tutti gli utilizzatori e aggiornare import statici, import dinamici, mock, test e documentazione. Non modificare URL pubblici o schema del database come conseguenza di un semplice spostamento di file.
- Tenere i test accanto al modulo verificato. Per modifiche al codice eseguire `bun run check` e i test pertinenti; per refactoring trasversali eseguire `bun run ci` e verificare i flussi coinvolti nel browser. Usare un database locale isolato per prove che scrivono dati.
- Quando cambiano responsabilità, confini o struttura delle directory, aggiornare `docs/architecture.md` e gli eventuali README interessati nella stessa modifica. Aggiornare anche queste regole se cambia una convenzione obbligatoria. Non eliminare o indebolire una regola soltanto per adattarla all'implementazione appena scritta.
- Prima di concludere, verificare che ogni nuovo file abbia un proprietario chiaro, che non siano stati introdotti cicli o import server nel client e che i controlli eseguiti siano riportati con eventuali limiti reali.

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
