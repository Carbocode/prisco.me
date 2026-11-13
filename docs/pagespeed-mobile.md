# Verifica PageSpeed mobile

Report di riferimento: https://pagespeed.web.dev/analysis/https-prisco-me/yjmum4qbi9?hl=it&form_factor=mobile

La copertina animata dell’articolo è esclusa dagli interventi, come richiesto.

## Interventi

| Segnalazione                   | Intervento e stato                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Errore React in console        | Corretto il copyright calcolato durante l’inizializzazione del Worker: il server rendeva 1970, il client l’anno corrente. Verificata l’idratazione della build di produzione.                                                                                                                                                                                         |
| Scoperta e priorità LCP        | Priorità alta alle immagini della Luna e delle stelle. Varianti responsive per i pianeti.                                                                                                                                                                                                                                                                             |
| Immagini sovradimensionate     | Varianti WebP lossless per pianeti, paesaggi e decorazioni, registrate nel manifest. Conservati SVG sorgenti, trasparenza ed effetti.                                                                                                                                                                                                                                 |
| Immagini senza dimensioni      | Dimensioni esplicite per stelle e nuvole. L’audit locale passa.                                                                                                                                                                                                                                                                                                       |
| CSS bloccante e catena critica | CSS iniziale gestito e inserito nell’HTML da TanStack Start; eliminato il link manuale tramite `?url`. L’audit locale non rileva richieste CSS bloccanti.                                                                                                                                                                                                             |
| JavaScript inutilizzato        | PostHog slim con sole estensioni utilizzate: eventi, navigazione, metriche, errori e registrazione dopo consenso. Stesso singleton per gli eventi del modulo contatti. Zod Mini per la ricerca delle route; schema completo dei contatti importato soltanto nella validazione server o nel modulo contatti. L’avviso è ridotto, ma resta nei runtime React e PostHog. |
| JavaScript legacy              | Web Vitals compilato localmente dal sorgente distribuito con il SDK, mantenendo le attribuzioni diagnostiche. Esclusi i fallback Array.at/findLast già coperti dalla baseline browser di Vite. L’audit locale passa.                                                                                                                                                  |
| Thread principale              | Diagnostica caricata dopo `load`, quando il browser è libero. Carta delle costellazioni disegnata solo quando visibile, riservandone subito l’altezza corretta.                                                                                                                                                                                                       |
| Reflow forzati                 | Ricalcoli accorpati, dimensioni del viewport lette insieme, scritture CSS ripetute evitate. Rimangono letture necessarie al layout della scena e ai componenti del framework: l’avviso non è completamente eliminato.                                                                                                                                                 |
| Cache media                    | Il report indica due file su `media.prisco.me` con TTL di quattro ore. La route locale `/media/$` ha già cache annuale, ma non controlla gli header del dominio R2 pubblico. Serve una regola sul dominio Cloudflare; non è stata modificata la configurazione remota.                                                                                                |
| Cache configurazione PostHog   | Circa 1 KiB con TTL di cinque minuti, controllato da PostHog. Non ne viene forzata una cache annuale perché è configurazione dinamica. Web Vitals viene invece servito tra gli asset locali con hash.                                                                                                                                                                 |
| Nome accessibile del logo      | Include il testo visibile “Vincenzo Prisco”.                                                                                                                                                                                                                                                                                                                          |
| Link di llms.txt               | Convertiti in link Markdown.                                                                                                                                                                                                                                                                                                                                          |

Gli avvisi LCP, Speed Index, TTI e peso totale dipendono dagli interventi sopra e dalle condizioni della misurazione; non costituiscono garanzie di uno specifico punteggio dopo la pubblicazione. Il report non suggerisce ulteriori origini per `preconnect`.

## Verifica

- `bun run check`, inclusi hash degli asset, formattazione, lint e tipi.
- Suite Vitest e build di produzione.
- Browser sulla produzione locale: idratazione mobile/desktop, selezione delle immagini responsive, caricamento dei font, consenso, carta delle costellazioni e navigazione.
- Lighthouse mobile sulla produzione locale, prima e dopo questa passata. Non è una nuova misurazione del sito pubblicato: la rete locale, i contenuti del database locale e il carico della macchina differiscono da PageSpeed pubblico. Ogni build è stata misurata una volta; i tempi sono indicativi.

La build usa l’opzione CSS inline di TanStack Start. L’integrazione Web Vitals usa un entrypoint sorgente distribuito con PostHog: dopo aggiornamenti del SDK occorre verificare nuovamente attribuzioni, consenso e caricamento delle estensioni.

Dopo il deploy va ripetuto PageSpeed sull’URL pubblico per confermare gli esiti con contenuti e CDN di produzione.

## Ulteriore ottimizzazione delle decorazioni e del layout

Le 13 istanze statiche composte soltanto da un’immagine raster dentro SVG sono ora immagini HTML con `srcSet`, dimensioni intrinseche e caricamento differito. Restano identici i contenitori, le posizioni e le trasformazioni CSS; `object-fit: contain` conserva le proporzioni dei fossili. Gli SVG sorgenti rimangono nel repository. La geode conserva la geometria SVG e i quattro riflessi animati.

Sono state aggiunte risoluzioni lossless più vicine alle dimensioni reali, comprese quelle per fossili, radici, cavità e pianeti. Le dimensioni esplicite dei livelli del deserto restano presenti.

Durante lo scroll, altezza del viewport e intervallo di scorrimento vengono letti dalla cache geometrica, aggiornata al cambiamento del layout. Le misure degli observer provengono dalle loro notifiche e le posizioni degli indicatori vengono scritte dopo tutte le misure della scena. Il caricamento dei font già completato non richiede un nuovo layout.

Verificati Firefox e Chromium su mobile e desktop, ridimensionamento, caricamento delle dune e attivazione delle immagini quando si raggiunge la sezione. Un confronto locale tra le immagini native e gli equivalenti contenitori SVG conferma la conservazione visiva.

Gli avvisi su compressione delle immagini lossless e quote dei runtime React/PostHog non eseguite durante Lighthouse possono rimanere. Non sono state eliminate funzionalità per azzerarli. L’accesso Cloudflare tramite Wrangler risulta scaduto e non rinnovabile nella sessione non interattiva: la cache remota non è stata modificata.
