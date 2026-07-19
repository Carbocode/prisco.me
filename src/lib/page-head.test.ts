import { describe, expect, it } from "vitest";

import { pageHead } from "./page-head";
import { siteUrl } from "./site";

describe("page metadata", () => {
  it("builds canonical and social metadata from one URL", () => {
    const head = pageHead({
      title: "Pagina",
      description: "Descrizione",
      path: "/pagina",
    });

    expect(head.links).toContainEqual({ rel: "canonical", href: "https://prisco.me/pagina" });
    expect(head.meta).toContainEqual({
      property: "og:url",
      content: "https://prisco.me/pagina",
    });
    expect(head.meta).toContainEqual({
      name: "twitter:description",
      content: "Descrizione",
    });
  });

  it("rejects ambiguous relative paths", () => {
    expect(() => siteUrl("pagina")).toThrow("Site paths must start with a slash");
  });
});
