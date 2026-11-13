# Verifica PageSpeed desktop

Report di riferimento: https://pagespeed.web.dev/analysis/https-prisco-me/yjmum4qbi9?hl=it&form_factor=desktop

Il report desktop originale presenta gli stessi problemi principali del mobile. L’elemento LCP indicato è lo sfondo di stelle, mentre sul mobile è la Luna: entrambi ora hanno priorità alta.

## Copertura degli interventi

| Voce                         | Stato                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Errore di idratazione React  | Corretto il copyright calcolato all’inizializzazione del Worker.                                                                           |
| CSS bloccante                | CSS iniziale inserito nell’HTML tramite TanStack Start.                                                                                    |
| JavaScript legacy            | Web Vitals locale e fallback Array non necessari esclusi per la baseline Vite.                                                             |
| JavaScript inutilizzato      | PostHog slim e validazione delle route compatta; restano quote dei runtime non eseguite durante l’audit.                                   |
| Immagini sovradimensionate   | Varianti responsive lossless; aggiunte risoluzioni intermedie da 1920 pixel per i paesaggi, da 512 per le nuvole, da 64/128 per le stelle. |
| Immagini senza dimensioni    | Dimensioni esplicite per stelle, nuvole, montagne e dune.                                                                                  |
| Reflow e thread principale   | Ridotte le misure ripetute e rinviato il disegno delle costellazioni; rimangono misure necessarie del layout e dei componenti.             |
| Nome accessibile del logo    | Include il nome visibile.                                                                                                                  |
| llms.txt                     | Link in sintassi Markdown.                                                                                                                 |
| Cache media                  | Dipende dal dominio pubblico Cloudflare. La copertina animata resta esclusa come richiesto.                                                |
| Cache configurazione PostHog | TTL deciso dal servizio, mantenuto perché si tratta di configurazione dinamica.                                                            |

Il peso complessivo della pagina e l’avviso sulle immagini non sono considerati completamente risolti: le illustrazioni rimangono lossless e il report pubblico include la copertina animata esclusa dall’intervento. Non sono stati eliminati effetti o introdotte illustrazioni diverse per browser.

## Verifica

L’ultima esecuzione Lighthouse desktop locale restituisce prestazioni 99/100. Passano gli audit di accessibilità, best practice e SEO, oltre a console, CSS bloccante, JavaScript legacy, scoperta LCP e dimensioni delle immagini. Restano gli avvisi su alcune immagini lossless, JavaScript inutilizzato e reflow.

Lighthouse desktop sulla build di produzione locale; controllo dei file responsive, delle dimensioni intrinseche e del caricamento di tutti i livelli del deserto. Eseguiti anche `bun run check`, la suite Vitest e la build.

Il test locale non sostituisce PageSpeed pubblico: database, rete e CDN differiscono. Dopo il deploy occorre ripetere la misurazione desktop sul sito pubblicato. Per i dettagli comuni e i limiti dell’integrazione SDK, vedere [la verifica mobile](./pagespeed-mobile.md).

## Ulteriore ottimizzazione delle decorazioni e del layout

Le 13 istanze statiche composte soltanto da un’immagine raster dentro SVG sono ora immagini HTML con `srcSet`, dimensioni intrinseche e caricamento differito. Restano identici i contenitori, le posizioni e le trasformazioni CSS; `object-fit: contain` conserva le proporzioni dei fossili. Gli SVG sorgenti rimangono nel repository. La geode conserva la geometria SVG e i quattro riflessi animati.

Sono state aggiunte risoluzioni lossless più vicine alle dimensioni reali, comprese quelle per fossili, radici, cavità e pianeti. Le dimensioni esplicite dei livelli del deserto restano presenti.

Durante lo scroll, altezza del viewport e intervallo di scorrimento vengono letti dalla cache geometrica, aggiornata al cambiamento del layout. Le misure degli observer provengono dalle loro notifiche e le posizioni degli indicatori vengono scritte dopo tutte le misure della scena. Il caricamento dei font già completato non richiede un nuovo layout.

Verificati Firefox e Chromium su mobile e desktop, ridimensionamento, caricamento delle dune e attivazione delle immagini quando si raggiunge la sezione. Un confronto locale tra le immagini native e gli equivalenti contenitori SVG conferma la conservazione visiva.

Gli avvisi su compressione delle immagini lossless e quote dei runtime React/PostHog non eseguite durante Lighthouse possono rimanere. Non sono state eliminate funzionalità per azzerarli. L’accesso Cloudflare tramite Wrangler risulta scaduto e non rinnovabile nella sessione non interattiva: la cache remota non è stata modificata.
