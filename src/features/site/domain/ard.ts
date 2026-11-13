import { SITE, siteUrl } from "@/config/site";

export const ardPath = "/.well-known/ard.json";

// ARD publisher manifest: advertise the existing read-only API, not an agent or registry.
export const ardManifest = {
  entries: [
    {
      "@context": "https://agenticresourcediscovery.org/context/v1",
      identifier: `urn:air:${new URL(SITE.origin).hostname}:api:published-articles`,
      displayName: `${SITE.name} — published articles`,
      type: "application/json",
      url: siteUrl("/api/content/v1/articles"),
      description:
        "Public read-only API for content published by Vincenzo Prisco. " +
        "GET returns data and pagination.nextCursor. The limit parameter accepts 1 to 50 items " +
        "(default 20); use cursor to retrieve the next page. " +
        "GET /api/content/v1/articles/{slug} returns a published article.",
      capabilities: ["ListPublishedArticles", "ReadPublishedArticle"],
      representativeQueries: [
        "Which articles has Vincenzo Prisco published?",
        "Find public Prisco.me content about software engineering.",
        "How can I read a Prisco.me article through its API?",
      ],
    },
  ],
};
