import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/config/site";

const llmsTxt = `# Prisco.me

> Prisco.me is the personal website and portfolio of Vincenzo Prisco, a software engineer and product builder who develops web and mobile applications.

## Main pages
- [Home](https://prisco.me/): introduction, approach to work, and selected projects.
- [Projects](https://prisco.me/progetti): published project descriptions and technologies.
- [Career](https://prisco.me/career): education and professional experience.
- [Blog](https://prisco.me/blog): articles and personal opinions.
- [About this site](https://prisco.me/about): technology, infrastructure, and source code for the website.
- [Contact](https://prisco.me/contact): inquiries about products, technical collaboration, and professional opportunities.
- [English home](https://prisco.me/en): English interface; other public pages also support the /en prefix.

## Key facts
- Prisco.me is Vincenzo Prisco's personal website.
- The site presents his background, professional journey, and selected projects.
- It is built with TanStack Start, React, and TypeScript, and hosted on Cloudflare.
- The website covers web and mobile development, software architecture, and AI integration.
- Italian and English interfaces are available. Editorial articles and project descriptions retain their original language.
- GitHub profile: Carbocode. The website's author is Vincenzo Prisco.

## Public content discovery
- [Sitemap](https://prisco.me/sitemap.xml): public page and article URLs.
- [RSS feed](https://prisco.me/rss.xml): published content updates.
- [Resource discovery manifest](https://prisco.me/.well-known/ard.json): describes the public read-only content API.
- [Published articles API](https://prisco.me/api/content/v1/articles): GET returns data and pagination.nextCursor. Use limit (1–50, default 20) and cursor for pagination.
- Read an individual published article with GET https://prisco.me/api/content/v1/articles/{slug}, using a slug returned by the list endpoint.
- Consult the current pages and API for project details and publication dates.

## Contact
- [Website](https://prisco.me/)
- [Contact page](https://prisco.me/contact)
- [LinkedIn](https://www.linkedin.com/in/vincenzoprisco/)
- [GitHub](${SITE.githubUrl})
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
