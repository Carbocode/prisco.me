# Correzioni successive all’audit

Implementate nello stesso workspace il 12 novembre 2026. L’audit originale sotto è conservato come fotografia precedente alle modifiche.

- Organizzazioni: scritture compatibili con la colonna legacy obbligatoria; test con query Drizzle sullo schema SQL originale. Aggiunta gestione descrizione, sito web e archiviazione.
- Concorrenza: la migrazione `0033_cms_integrity.sql` controlla la versione prima di inserire lo snapshot e protegge l’intera transazione. Aggiornamenti, revisioni, associazioni e audit vengono annullati insieme. Il salvataggio restituisce la riga effettivamente aggiornata, senza adottare la versione di un successivo salvataggio concorrente. Anche le transizioni di stato conservano snapshot e audit nello stesso batch.
- Autori: modifiche consentite soltanto alle proprie bozze; interfaccia coerente con i permessi.
- Media: eliminata la riscrittura distruttiva di contenuti e revisioni. Gli asset utilizzati, anche soltanto nello storico, non possono essere cestinati. Quelli inutilizzati vengono nascosti senza eliminare R2 e sono ripristinabili. Trigger impediscono di ricollegare un media cestinato con un form obsoleto. Nessuna cancellazione fisica automatica: la conservazione è indefinita.
- Redirect: applicati dalle route pubbliche, aggiornati anche cambiando categoria; catene accorciate nelle mutazioni e gestione del ritorno a uno slug precedente. Lo slug di una categoria associata ad articoli è protetto: occorre riassegnare gli articoli prima di modificarlo o archiviare la categoria.
- Storico: nuove revisioni complete di categorie, tag ordinati e associazioni alle esperienze; confronto visivo prima del ripristino. Le vecchie revisioni prive di queste informazioni mantengono le associazioni attuali: non è possibile ricostruire retroattivamente dati mai salvati.
- Programmazione: portfolio e archivi condividono la visibilità degli articoli programmati scaduti; dashboard e filtri mostrano lo stato effettivo. La data è persistita nei salvataggi e aggiornabile dagli editor anche dopo la pubblicazione.
- Form: protezione della navigazione interna e dell’uscita dal browser, gestione delle modifiche effettuate durante una richiesta, editor e controlli bloccati durante i salvataggi. Non è stato introdotto un autosalvataggio delle bozze: il salvataggio rimane esplicito.
- Aggiornamenti parziali: rimossi i default che azzeravano tag/esperienze o ripristinavano la configurazione categoria quando i campi erano omessi; due test dedicati.
- Relazioni: validazione server di categorie, tag, media e organizzazioni attivi, vincoli database sulle scritture e protezione dallo spostamento di tag già utilizzati.
- Anteprime link: le nuove anteprime usano l’immagine remota senza creare copie R2 non gestite. Eventuali copie orfane preesistenti non sono state eliminate.
- Campi amministrativi: aggiunti ruolo/periodo progetto, canonical URL, collegamenti alle esperienze e riga del marquee nei tag.
- Tassonomie: cestino e ripristino nel dashboard CMS; i nomi e gli slug degli elementi archiviati restano riservati, recuperabili ripristinando l’elemento.
- Caricamenti: contatori aggregati sull’intero database, utilizzi media aggregati in SQL, documenti completi caricati soltanto per il singolo articolo pubblico. Archivi e picker continuano a paginare le liste di metadati nel client: per volumi molto elevati resta opportuno spostare anche questa paginazione sul server.

Migrazione verificata su un D1 locale isolato e applicata al D1 locale del progetto. Nessuna migrazione o distribuzione in produzione. Prima di distribuire il codice, applicare anche in produzione `0033_cms_integrity.sql` attraverso il normale flusso delle migrazioni.

Verifiche aggiornate: 97 test superati complessivamente, inclusi otto test di regressione SQLite su transazioni, media, relazioni, conteggi e compatibilità organizzazioni, oltre ai test esistenti. Typecheck, lint, build, controllo asset e controllo Drizzle superati. Nessun test browser end-to-end. Il controllo globale di formattazione resta bloccato dai tre HTML preesistenti di `design-proposals`, non modificati da questo intervento.

---

# Audit funzionale CMS — 12 novembre 2026

Revisione di interfacce CMS, validazione, autorizzazioni, servizi, repository, schema e integrazioni con le pagine pubbliche e il portfolio. Nessuna modifica applicativa o ai dati. I difetti indicati derivano dalla lettura dei flussi; dove specificato è stata eseguita una riproduzione locale. Nessuna verifica sul database remoto o end-to-end su D1/R2.

## Priorità alta

1. **Creazione organizzazioni bloccata dalle migrazioni.** `drizzle/0018_migrate_portfolio_to_cms.sql:10`, `drizzle/0019_rename_organization_type.sql:4`, `src/features/cms/server/organization.functions.ts:28`. La vecchia colonna `type` resta NOT NULL senza default; Drizzle scrive soltanto `organization_type`. Riprodotto in SQLite in memoria eseguendo la creazione della tabella e la migrazione 0019: l'INSERT usato dall'applicazione fallisce con `NOT NULL constraint failed: cms_organizations.type`. Serve allineare schema fisico e scritture preservando le associazioni.

2. **Il salvataggio concorrente può cambiare categorie/tag anche quando perde il controllo di versione.** `src/features/cms/server/article.service.ts:169`. Il batch protegge con `version` soltanto l'UPDATE dell'articolo; DELETE/INSERT delle associazioni, revisione, redirect e audit vengono comunque eseguiti se quell'UPDATE modifica zero righe. Il controllo finale confronta la versione con quella iniziale: una modifica concorrente può farlo passare anche se il proprio UPDATE è fallito. La collisione sul numero di revisione può fermare alcuni interleaving, ma non garantisce sicurezza, ad esempio in concorrenza con pubblicazione o eliminazione media. Occorre un vincolo atomico sull'intera mutazione e verificare il risultato effettivo dell'UPDATE.

3. **Gli author possono modificare direttamente articoli già pubblicati.** `src/lib/cms-permissions.ts:51`, `src/features/cms/server/article.service.ts:121`, `src/features/cms/domain/workflow.ts:10`. Non hanno il permesso di pubblicare, ma possono aggiornare i propri articoli indipendentemente dallo stato. Il contenuto pubblico usa la stessa riga e cambia subito. Se il permesso di pubblicazione deve comportare revisione editoriale, attualmente è aggirabile dopo la prima pubblicazione. Serve vietare queste modifiche oppure separare bozza e versione pubblicata.

4. **Redirect automatici salvati ma mai applicati.** `src/features/cms/server/public.functions.ts:22`, `src/routes/$archiveSlug/$.tsx:40`, `src/features/cms/server/article.service.ts:207`. `getCmsRedirectFn` non ha chiamanti e non risultano altri lettori dei redirect nel codice pubblico. Cambiare lo slug produce il record, ma il vecchio URL termina nella ricerca del contenuto e restituisce 404. L'interfaccia promette invece che resterà raggiungibile. Inoltre il cambio della sola categoria e il cambio dello slug della categoria non producono redirect. Serve integrare la risoluzione nelle route e coprire tutti i cambi di percorso.

5. **L'eliminazione media rimane distruttiva anche per lo storico.** `src/features/cms/server/media.functions.ts:126`, `:149`, `:200`. Rimuove nodi dai documenti e dalle revisioni, senza creare una revisione preventiva, poi cancella subito R2. Se il controllo successivo trova un conflitto ripristina soltanto il media, senza annullare le dissociazioni già riuscite. Un errore mostrato all'utente può quindi lasciare comunque modifiche ai contenuti. Servono una politica esplicita di recupero e un flusso che non modifichi parzialmente i contenuti in caso di conflitto.

6. **L'ultimo controllo prima della cancellazione R2 non chiude la concorrenza.** `src/features/cms/server/media.functions.ts:177`, `src/features/cms/server/article.service.ts:69`, `:123`. Tra controllo e cancellazione un salvataggio può reintrodurre l'ID: le scritture degli articoli non verificano che i media siano attivi, e una foreign key accetta un media soft-deleted. Anche il ripristino revisioni può reintrodurlo. Inoltre la pulizia dell'hero categoria aggiorna per solo ID, potendo cancellare una selezione fatta nel frattempo. Servono controlli coordinati sulle scritture e condizioni sull'associazione effettivamente letta.

7. **Archiviare una categoria può rendere irraggiungibili articoli pubblicati.** `src/features/cms/server/category.functions.ts:57`, `src/features/cms/server/article.service.ts:514`. Nessuna verifica sugli articoli associati e nessuna riassegnazione. Le categorie pubbliche escludono quelle archiviate, mentre l'hydration degli articoli continua a restituirle. Restano link/canonical a una categoria non più risolvibile. Serve bloccare l'archiviazione se utilizzata, oppure richiedere una destinazione con aggiornamento dei percorsi.

## Funzioni incomplete o incoerenti

8. **Revisioni non complete.** `src/features/cms/server/article.service.ts:174`, `:395`. Lo snapshot salva la sola riga articolo: categorie, tag e relativo ordine sono fuori dallo storico. Ripristinare titolo, slug e contenuto mantiene quindi le associazioni attuali. Manca anche l'anteprima/diff della revisione: l'interfaccia espone soltanto il ripristino. Il batch del ripristino può inoltre aggiungere revisione e audit prima di accorgersi del conflitto sull'UPDATE.

9. **Pubblicazione programmata incoerente con il portfolio.** `src/features/cms/server/cms.repository.ts:139`, `src/server/portfolio.ts:74`, `:90`, `:111`. Gli archivi considerano pubblici gli stati `scheduled` con data trascorsa; il portfolio richiede soltanto `published`. Non risulta una transizione automatica di stato. Un progetto programmato appare negli archivi alla scadenza, ma non nella home/portfolio e nelle associazioni alle esperienze. Anche nel dashboard rimane etichettato come programmato.

10. **Data di pubblicazione modificabile a video ma non salvata con Salva.** `src/features/cms/components/article-form.tsx:235`, `:594`. `publishedAt` viene inviato soltanto da Pubblica, azione nascosta per articoli pubblicati o programmati. Modificare la data di un articolo esistente e salvare dà successo ma non cambia la data. Per riprogrammare occorre ritirare e ripubblicare, togliendo temporaneamente il contenuto online. Separare chiaramente le operazioni oppure consentire il salvataggio della data con le opportune autorizzazioni.

11. **Protezione dalle modifiche perse solo alla chiusura/ricarica.** `src/features/cms/components/article-form.tsx:184`, `:262`. Manca un blocco della navigazione interna: i Link del router possono abbandonare modifiche non salvate. Durante un salvataggio i campi restano modificabili e al successo viene sempre azzerato `dirty`, anche se nel frattempo è stato scritto altro. Manca un recupero locale/autosalvataggio. Serve almeno distinguere la versione del form inviata da quella corrente e proteggere la navigazione interna.

12. **Permessi applicati sul server ma non nelle azioni dell'interfaccia.** `src/features/cms/components/article-form.tsx:377`, `src/routes/dashboard/cms/categories.tsx:321`, `src/lib/cms-permissions.ts:51`. L'author vede azioni di pubblicazione, archiviazione, ripristino e gestione tassonomie/media che il server rifiuta. Non è un bypass server: è una funzionalità presentata come disponibile che termina in errore. Derivare visibilità/abilitazione dai permessi effettivi.

13. **Relazioni validate solo sintatticamente.** `src/features/cms/domain/validation.ts:40`, `src/features/cms/server/article.service.ts:69`, `src/features/cms/server/tag.functions.ts:44`. UUID validi e foreign key non assicurano che categorie, tag, organizzazioni e media siano attivi, né che i tag appartengano alla categoria scelta. Il vincolo è gestito nel form, ma non nel server. Spostare un tag a un'altra categoria lascia inoltre inalterate le associazioni preesistenti. Serve validazione di dominio nelle mutazioni.

14. **Immagini delle anteprime link fuori dalla libreria.** `src/features/cms/server/embed.functions.ts:77`. Le immagini Open Graph vengono copiate in R2 senza record `cms_media`. Non appaiono in libreria, non hanno conteggi di utilizzo e non vengono recuperate dal flusso di eliminazione media. Ripetere le anteprime può creare copie orfane anche senza salvare l'articolo. Registrare questi asset e gestirne il ciclo di vita oppure usare una cache dedicata con scadenza.

15. **Campi pubblici senza gestione CMS completa.** `src/db/cms-schema.ts:107`, `:203`, `src/features/cms/domain/validation.ts:44`, `src/features/cms/components/article-form.tsx:112`. Ruolo e periodo progetto sono supportati da schema, API e pagine pubbliche, ma mancano dal form. `marqueeRow` è usato nella home ma manca dalla gestione tag. `canonicalUrl` è letto e ripristinato, ma non modificabile dal normale flusso. L'associazione progetti-esperienze viene letta dal portfolio senza una gestione nelle route CMS esaminate. Valutare questi elementi come funzioni da completare, se devono essere amministrabili.

16. **Archiviazione tassonomie senza ripristino.** `src/features/cms/server/category.functions.ts:57`, `src/features/cms/server/tag.functions.ts:65`, `src/features/cms/server/organization.functions.ts:49`. Le righe sono nascoste con soft delete, ma non esistono elenco cestino o operazioni di ripristino. I vincoli univoci continuano a riservare nomi e slug: ricreare un elemento archiviato con gli stessi valori fallisce. Manca anche una risposta specifica per questo caso.

17. **Errore R2 nascosto dall'interfaccia.** `src/routes/dashboard/cms/media.tsx:292`. Il server restituisce `storageDeleted: false` dopo due fallimenti, ma il chiamante ignora il risultato e mostra successo. Il file resta accessibile; l'unica traccia persistente è l'audit, senza pagina CMS o coda di retry dedicata. Esporre l'esito reale e predisporre un recupero verificabile.

18. **Statistiche dashboard troncate e caricamenti non scalabili.** `src/routes/dashboard/cms/index.tsx:28`, `src/features/cms/server/media.functions.ts:29`, `src/features/cms/server/article.service.ts:482`, `src/routes/$archiveSlug/$.tsx:41`. I contatori usano al massimo i primi 100 articoli ignorando `total`. La libreria rilegge tutti i contenuti per contare gli usi; le route pubbliche caricano l'intero archivio, inclusi i documenti, prima di filtrare. La cancellazione media scansiona e potenzialmente aggiorna anche tutte le revisioni in un solo batch. Serve paginazione/filtering nel database, conteggi aggregati e una strategia per grandi volumi.

## Verifiche e limiti

- `bun run test`: 24 file, 87 test superati. Non risultano test dedicati ai servizi server CMS, alla concorrenza, alle mutazioni D1/R2 o al flusso editoriale completo.
- `bun run typecheck`, `bun run lint`, `bun run db:check`: superati. Il controllo Drizzle non esegue le migrazioni: non rileva il problema della colonna legacy delle organizzazioni.
- `bun run assets:check`: superato.
- `bun run check`: fallisce sul formato di tre file preesistenti: `design-proposals/landing-antigravity38.html`, `landing-gpt61.html`, `landing-opus55.html`. Lint e typecheck sono stati quindi eseguiti separatamente.
- Riproduzione organizzazioni: database SQLite esclusivamente in memoria, senza modificare il database di sviluppo.
- Non eseguiti browser, build, test end-to-end o accessi al database remoto. Le criticità di concorrenza sono dedotte dall'ordine e dalle condizioni delle query, non da un test di carico.

Ordine suggerito: sicurezza delle mutazioni e dei media; creazione organizzazioni; permessi sul contenuto pubblicato; redirect/categorie; revisioni complete; programmazione e persistenza del form; completamento delle funzioni amministrative.
