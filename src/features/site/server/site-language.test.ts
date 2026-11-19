import { expect, it, vi } from "vitest";

import { serveSiteByLanguage } from "./site-language";

it.each([
  ["en-GB,it;q=0.8", undefined, "/?source=visit", "/en?source=visit"],
  ["it;q=0.2,en-US;q=0.9", undefined, "/", "/en"],
  ["it,en;q=0.8", undefined, "/", null],
  ["en;q=0,fr;q=1", undefined, "/", null],
  ["fr,de", undefined, "/", null],
  ["en", "other=1; prisco-site-language=it", "/", null],
  ["it", "prisco-site-language=en", "/", "/en"],
  ["it", "prisco-site-language=en", "/contact", null],
  ["it", undefined, "/en", null],
] as const)(
  "negotiates %s with preference %s on %s",
  async (acceptLanguage, cookie, path, target) => {
    const url = new URL(path, "https://prisco.me");
    const headers = new Headers({ "Accept-Language": acceptLanguage });
    if (cookie) headers.set("Cookie", cookie);
    const render = vi.fn(async () => new Response("original page"));
    const response = await serveSiteByLanguage(new Request(url, { headers }), url, render);

    expect(response.headers.get("Location")).toBe(target);
    expect(response.status).toBe(target ? 302 : 200);
    expect(render).toHaveBeenCalledTimes(target ? 0 : 1);
    if (url.pathname === "/") {
      expect(response.headers.get("Cache-Control")).toBe("private, no-store");
      expect(response.headers.get("Vary")).toBe("Accept-Language, Cookie");
    }
  },
);

it.each([
  ["/?site-language=it", "en", "en", "it"],
  ["/en/contact?site-language=en", "it", "it", "en"],
] as const)(
  "honors the explicit choice at %s before the browser and cookie",
  async (path, browser, saved, selected) => {
    const url = new URL(path, "https://prisco.me");
    const request = new Request(url, {
      headers: { "Accept-Language": browser, Cookie: `prisco-site-language=${saved}` },
    });
    const response = await serveSiteByLanguage(request, url, () => new Response("selected page"));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("selected page");
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    const cookie = response.headers.get("Set-Cookie");
    expect(cookie).toContain(`prisco-site-language=${selected};`);
    const nextHome = new URL("/", url);
    const next = await serveSiteByLanguage(
      new Request(nextHome, {
        headers: { "Accept-Language": browser, Cookie: cookie?.split(";", 1)[0] ?? "" },
      }),
      nextHome,
      () => new Response("Italian home"),
    );
    expect(next.status).toBe(selected === "it" ? 200 : 302);
  },
);
