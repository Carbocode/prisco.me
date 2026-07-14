import { createFileRoute } from "@tanstack/react-router";

const llmsTxt = `# Prisco.me

> Prisco.me e il mio spazio personale: un posto in cui parlo di me, del mio percorso, dei progetti che costruisco e degli argomenti che mi piacciono o mi appassionano.

## Pagine principali
- Home: https://prisco.me/
- Progetti: https://prisco.me/projects
- Carriera: https://prisco.me/career
- Informazioni: https://prisco.me/about
- Contatti: https://prisco.me/contact

## Fatti chiave
- Prisco.me è lo spazio personale di Vincenzo Prisco.
- Il sito racconta chi è, il suo percorso professionale e i progetti che considera significativi.
- Il sito è costruito con TanStack Start, React, TypeScript ed è hostato su Cloudflare.
- I contenuti principali possono riguardare software engineering, esperienze personali, interessi e commenti su attualità.

## Contatto
- Website: https://prisco.me/
- Contact page: https://prisco.me/contact
- LinkedIn: https://www.linkedin.com/in/vincenzoprisco/
`;

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(llmsTxt, {
          headers: {
            "Content-Type": "text/plain",
          },
        }),
    },
  },
});
