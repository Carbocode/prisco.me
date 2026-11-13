# Home

`home-page.tsx` compone la pagina, collega le animazioni al contenitore e gestisce l’apertura del footer. `home.types.ts` definisce i dati in ingresso, senza dipendenze dal server o dal CMS.

- `sections/`: le sei sezioni della storia. Ogni sezione riceve soltanto i dati che usa. La preparazione degli estratti del percorso vive accanto alla sezione interessata.
- `artwork/`: illustrazioni e definizioni SVG, separate dal contenuto delle sezioni. Contiene anche le immagini responsive dei fossili e del deserto; i sorgenti SVG e i WebP restano in `public/home/`, con il manifest in `scripts/static-artwork.json`.
- `motion/`: `animate-home.js` coordina geometria, scroll, header e indicatori. I moduli separati gestiscono costellazioni e relativi dati, percorso orizzontale, parole del manifesto ed effetti del puntatore. `animation-scope.js` possiede listener, observer e frame e li rilascia allo smontaggio. Il calcolo puro della posizione del percorso e il relativo test sono nello stesso gruppo.
- `styles/`: CSS diviso per scena e per responsabilità condivisa. `home.css` è l’unico punto d’ingresso e mantiene esplicito l’ordine della cascata.

Le sezioni compongono le illustrazioni; queste ultime non importano sezioni o pagina. Le animazioni lavorano sui `data-*` già presenti nel markup, senza dipendere dai componenti React o dai dati del CMS.

I test della pagina verificano rendering SSR e comportamento della storia. I test visivi leggono ricorsivamente gli import del CSS. Le funzioni pure mantengono i test accanto alla loro implementazione.
