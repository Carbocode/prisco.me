import { createFileRoute } from "@tanstack/react-router";

const llmsTxt = `# Prisco.me

> Prisco.me is Vincenzo Prisco's personal website, covering his background, career, projects, and topics he finds interesting.

## Main pages
- [Home](https://prisco.me/)
- [Projects](https://prisco.me/progetti)
- [Career](https://prisco.me/career)
- [About](https://prisco.me/about)
- [Contact](https://prisco.me/contact)

## Key facts
- Prisco.me is Vincenzo Prisco's personal website.
- The site presents his background, professional journey, and selected projects.
- It is built with TanStack Start, React, and TypeScript, and hosted on Cloudflare.
- Topics may include software engineering, personal experiences, interests, and commentary on current events.
- Public pages and editorial content are primarily in Italian.

## Contact
- [Website](https://prisco.me/)
- [Contact page](https://prisco.me/contact)
- [LinkedIn](https://www.linkedin.com/in/vincenzoprisco/)
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
