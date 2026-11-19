import { describe, expect, it } from "vitest";

import { localizedPath, originalPath, siteLocale } from "./site";

describe("localized site URLs", () => {
  it.each([
    ["/", "/en"],
    ["/?source=home#experience", "/en?source=home#experience"],
    ["/blog/article", "/en/blog/article"],
    ["/career#experience-itt-diploma", "/en/career#experience-itt-diploma"],
    ["/dashboard/profile", "/en/dashboard/profile"],
  ])("round-trips %s", (original, english) => {
    expect(localizedPath(original, "en")).toBe(english);
    expect(originalPath(english)).toBe(original);
    expect(siteLocale(english)).toBe("en");
  });

  it.each([
    "/dashboard/cms",
    "/dashboard/cms/articles/new",
    "/preview/articles/123",
    "/api/content/v1/articles",
    "/media/file.webp",
    "/sitemap.xml",
    "https://example.org/about",
  ])("leaves %s outside localization", (path) => {
    expect(localizedPath(path, "en")).toBe(path);
    expect(originalPath(`/en${path}`)).toBe(`/en${path}`);
  });
});
