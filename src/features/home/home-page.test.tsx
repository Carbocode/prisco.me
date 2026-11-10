import { readFileSync } from "node:fs";

import { act } from "react";
import type { ComponentProps } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";

import type { Experience, Project } from "@/lib/projects";

import { HomePage } from "./home-page";

vi.mock("@/components/header", () => ({
  default: (props: ComponentProps<"header">) => <header {...props}>Header originale</header>,
}));
vi.mock("@/components/page-shell", () => ({ SiteFooter: () => <footer>Footer originale</footer> }));
const project: Project = {
  id: "project",
  slug: "progetto-cms",
  title: "Titolo dal CMS",
  summary: "Descrizione aggiornata",
  description: "",
  role: "Engineer",
  company: "Azienda",
  author: { name: "Vincenzo" },
  skills: [],
  content: "",
};
const experience: Experience = {
  id: "career",
  kind: "work",
  org: "Organizzazione aggiornata",
  title: "Ruolo aggiornato",
  period: "2025 – oggi",
  startDate: "2025-01",
  endDate: "",
  current: true,
  narrative: "Percorso dal database",
  skills: [],
  projects: [],
};
const props = {
  projects: [project],
  experiences: [experience],
  articles: [
    { id: "blog", slug: "articolo-cms", title: "Articolo pubblicato", excerpt: "Dal CMS" },
  ],
};
afterEach(() => {
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});
it("rende i contenuti pubblicati e il percorso dal database anche senza JavaScript", () => {
  const markup = renderToStaticMarkup(<HomePage {...props} />);
  expect(markup).toContain('href="/progetti/progetto-cms"');
  expect(markup).toContain('href="/blog/articolo-cms"');
  expect(markup).toContain("Organizzazione aggiornata");
  expect(markup).toContain("Percorso dal database");
  expect(markup).toContain('href="/career#experience-career"');
  expect(markup).toContain("line-clamp-4");
  const title = markup.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, "");
  expect(title).toContain("Ciao, sono Vincenzo.");
  expect(title).toContain("Creo esperienze digitali.");
  expect(markup).not.toContain("Proposta di design statica");
  expect(markup).toContain('class="home-page is-framed relative"');
});
it("inizializza e smonta le animazioni senza lasciare observer o eventi scroll", async () => {
  const disconnect = vi.fn();
  class Observer {
    observe() {}
    unobserve() {}
    disconnect = disconnect;
  }
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("ResizeObserver", Observer);
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const remove = vi.spyOn(HTMLElement.prototype, "removeEventListener");
  const el = document.createElement("div");
  document.body.appendChild(el);
  const root = createRoot(el);
  await act(async () => root.render(<HomePage {...props} />));
  expect(el.querySelector("[data-sky-svg] circle")).not.toBeNull();
  const scrollport = el.querySelector<HTMLElement>("[data-home-scroll]");
  expect(scrollport?.querySelector("footer")).toBeNull();
  expect(el.querySelector("[data-home-page] footer")).toBeNull();
  expect(el.querySelector("footer")).not.toBeNull();
  expect(scrollport?.querySelector(".home-traversata")).not.toBeNull();
  if (!scrollport) throw new Error("Missing page scroll container");
  await act(async () => {
    scrollport.scrollTop = 200;
    scrollport.dispatchEvent(new Event("scroll"));
  });
  expect(el.querySelector(".gauge")?.classList.contains("is-visible")).toBe(true);
  let viewportHeight = 700;
  Object.defineProperties(scrollport, {
    scrollHeight: { configurable: true, value: 2000 },
    clientHeight: { configurable: true, get: () => viewportHeight },
  });
  const scrollToPosition = async (position: number) => {
    await act(async () => {
      scrollport.scrollTop = position;
      scrollport.dispatchEvent(new Event("scroll"));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
  };
  const page = el.querySelector("[data-home-page]");
  await scrollToPosition(300);
  expect(page?.classList.contains("is-framed")).toBe(false);
  await scrollToPosition(1300);
  expect(page?.classList.contains("is-framed")).toBe(true);
  expect(el.querySelector("[data-home-header]")?.hasAttribute("inert")).toBe(false);
  // Opening the frame increases the scroll range: continuing down must not hide it.
  viewportHeight = 600;
  await scrollToPosition(1350);
  expect(page?.classList.contains("is-framed")).toBe(true);
  await scrollToPosition(1400);
  expect(page?.classList.contains("is-framed")).toBe(true);
  await scrollToPosition(1000);
  await scrollToPosition(1020);
  expect(page?.classList.contains("is-framed")).toBe(false);
  await scrollToPosition(0);
  expect(page?.classList.contains("is-framed")).toBe(true);
  await scrollToPosition(200);
  const footerToggle = el.querySelector<HTMLButtonElement>('[aria-controls="home-footer-content"]');
  if (!footerToggle) throw new Error("Missing footer toggle");
  await act(async () => footerToggle.click());
  expect(el.querySelector(".home-site")?.getAttribute("data-footer-open")).toBe("true");
  expect(el.querySelector("[data-home-page]")?.hasAttribute("inert")).toBe(true);
  expect(el.querySelector("#home-footer-content")?.hasAttribute("inert")).toBe(false);
  await act(async () => footerToggle.click());
  expect(el.querySelector(".home-site")?.getAttribute("data-footer-open")).toBe("false");
  expect(scrollport.scrollTop).toBe(200);
  const scrollTo = vi.fn();
  scrollport.scrollTo = scrollTo;
  await act(async () => {
    el.querySelector<HTMLAnchorElement>(".scroll-cue")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  });
  expect(scrollTo).toHaveBeenCalledWith({ top: 320, behavior: "smooth" });
  await act(async () => root.unmount());
  expect(disconnect).toHaveBeenCalled();
  expect(remove.mock.calls.some(([event]) => event === "scroll")).toBe(true);
  remove.mockRestore();
});

it("mantiene viewport e riferimenti locali delle illustrazioni SVG esterne", () => {
  const markup = renderToStaticMarkup(<HomePage {...props} />);
  const document = new DOMParser().parseFromString(markup, "text/html");
  const images = document.querySelectorAll("svg image");
  expect(images.length).toBeGreaterThan(0);
  images.forEach((image) => {
    const path = image.getAttribute("href");
    if (!path?.startsWith("/home/")) throw new Error("Unexpected artwork path");
    const source = readFileSync(`public${path}`, "utf8");
    const artwork = new DOMParser().parseFromString(source, "image/svg+xml");
    expect(artwork.querySelector("parsererror")).toBeNull();
    const viewBox = artwork.documentElement.getAttribute("viewBox")?.split(" ");
    expect(viewBox?.slice(2)).toEqual([image.getAttribute("width"), image.getAttribute("height")]);
    for (const match of source.matchAll(/url\(#([^)]*)\)/g)) {
      expect(artwork.getElementById(match[1]), `${path}: ${match[1]}`).not.toBeNull();
    }
  });
  expect(document.querySelector(".geode-crystals > image")).not.toBeNull();
  expect(document.querySelectorAll(".geode-glint")).toHaveLength(4);
});
