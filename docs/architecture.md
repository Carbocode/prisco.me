# Organizzazione del progetto

Le regole obbligatorie per gli agenti sono in [AGENTS.md](../AGENTS.md), che richiede la lettura di questa guida prima delle modifiche. Questa guida descrive le responsabilità attuali e deve essere aggiornata insieme ai cambiamenti di struttura. Per decidere dove aggiungere codice, individuare prima la feature proprietaria nella tabella seguente e poi il tipo di responsabilità; il codice condiviso mantiene un proprietario esplicito.

Il codice applicativo è organizzato per funzionalità in `src/features`. Una feature possiede le proprie pagine, i componenti specifici, i modelli e le operazioni server. Le directory interne esistono quando servono: non occorre riprodurre la stessa struttura per ogni feature.

## Route e shell

`src/routes` conserva la struttura di URL prevista da TanStack Start. Le route definiscono loader, validazione dei parametri, protezione degli accessi, endpoint e `head()`. Le viste più estese sono importate da `features/*/pages`.

Le viste leggono i dati del router attraverso `getRouteApi`, senza importare il modulo della route. I dati strutturati JSON-LD rimangono nella configurazione `head()` tramite `scripts` e `children: JSON.stringify(...)`.

`src/app/root-document.tsx` possiede il documento HTML e i provider globali; `src/app/query-client.tsx` configura React Query. `src/router.tsx`, `src/server.ts` e gli altri ingressi del framework rimangono nella posizione prevista dalla configurazione. `routeTree.gen.ts` è generato dal router.

## Responsabilità delle feature

| Feature     | Responsabilità                                                                    |
| ----------- | --------------------------------------------------------------------------------- |
| `account`   | Profilo, autenticazione personale, autorizzazioni e gestione account              |
| `admin`     | Amministrazione degli utenti                                                      |
| `analytics` | Provider e integrazioni di telemetria nel browser                                 |
| `auth`      | Accesso, client di autenticazione, configurazione server, permessi e Turnstile    |
| `career`    | Percorso professionale, Gantt, illustrazioni e calcoli della timeline             |
| `cms`       | Gestione editoriale, tassonomie, organizzazioni, media, revisioni e pubblicazione |
| `contact`   | Questionario, modello dei passaggi, validazione e invio delle richieste           |
| `content`   | Modello dei documenti, archivi pubblici, lettura degli articoli, embed e SEO      |
| `dashboard` | Shell, navigazione e breadcrumb dell'area riservata                               |
| `editor`    | Composizione Plate, plugin, nodi, toolbar, dialog e trasformazioni                |
| `home`      | Sezioni della landing, illustrazioni, animazioni e stili delle scene              |
| `portfolio` | Modello e lettura del portfolio, card e tecnologie                                |
| `privacy`   | Consenso cookie e pagine informative                                              |
| `site`      | Pagine generali, pagina non trovata e metadati comuni                             |

## Confini e dipendenze

`src/config/site.ts` contiene identità e impostazioni comuni del sito. `src/lib` ospita solo utilità trasversali: la logica specifica di una feature rimane nella relativa directory `domain` o accanto al suo utilizzatore.

I modelli di dominio e le funzioni pure non dipendono dalle pagine o dai componenti React. I componenti possono usare modelli e servizi della feature; il codice riutilizzato da più funzionalità ha un proprietario esplicito. Per esempio, il modello canonico del documento e gli embed appartengono a `content` e sono utilizzati anche dall'editor. Il renderer pubblico non importa l'editor Plate.

`*.functions.ts` espone le server function e applica i controlli di accesso necessari. Repository, connessioni D1, accesso R2 e configurazione di autenticazione rimangono nei moduli server. I componenti client importano il confine delle server function, senza accedere direttamente ai repository.

Il servizio degli articoli è suddiviso in `cms/server/articles`: query, mutazioni, pubblicazione, revisioni, idratazione delle relazioni e snapshot hanno moduli dedicati. La configurazione della connessione e i dati pubblici dell'autore sono separati per evitare dipendenze circolari.

## Componenti e moduli estesi

`src/components/ui` contiene le primitive shadcn. Le sezioni funzionali le usano direttamente, rispettando le regole di `AGENTS.md`. `layout`, `artwork`, `media` e `data-table` contengono i componenti condivisi dal sito. I componenti legati a una sola funzionalità rimangono nella feature.

Il form degli articoli è in `cms/components/article-form`: la vista compone i campi, `use-article-form.ts` gestisce stato e azioni, mentre tipi, conversioni e confronto delle revisioni hanno file propri. L'editor separa configurazione dei plugin, nodi, dialog, toolbar e dati statici della palette. Il questionario contatti separa il modello del flusso dalla presentazione.

La suddivisione segue responsabilità e dipendenze; una vista può rimanere estesa quando compone molti campi correlati. Evitare file di riesportazione che nascondano dipendenze o mescolino moduli browser e server.

## Stili, asset e date

`src/styles.css` è l'ingresso globale. Gli import rendono esplicito l'ordine della cascata: fondamenti, paesaggio, superfici, contenuti, animazioni, tema e utility. Gli stili specifici di contenuti, editor e home appartengono alle rispettive feature. La home mantiene un proprio ingresso CSS e una suddivisione per scena.

I sorgenti delle illustrazioni restano in `public`. Le cache WebP sono descritte da `scripts/static-artwork.json`, generate con `bun run assets:render` e controllate con `bun run assets:check`.

`src/lib/dates.ts` interpreta le date pubbliche nel fuso `Europe/Rome`, definito in `src/config/site.ts`, così server e browser producono lo stesso giorno e anno. I valori correnti destinati al rendering non vanno calcolati durante l'inizializzazione dei moduli Worker.

## Verifica delle modifiche

I test sono collocati accanto all'implementazione. `bun run ci` verifica asset, stile del codice, tipi, test, migrazioni e compilazione. Per modifiche strutturali che attraversano route e server, verificare anche navigazione pubblica, autenticazione, pagine del CMS e creazione di una bozza in un database locale isolato.

Lo spostamento dei file applicativi non richiede modifiche agli URL pubblici o alle migrazioni del database.
