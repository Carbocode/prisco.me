import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";

import type { Experience, Project } from "@/lib/projects";

import { HomePage } from "./home-page";

vi.mock("@/components/header", () => ({ default: () => <header>Header originale</header> }));
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
  const footerToggle = el.querySelector<HTMLButtonElement>('[aria-controls="home-footer-content"]');
  if (!footerToggle) throw new Error("Missing footer toggle");
  await act(async () => footerToggle.click());
  expect(el.querySelector(".home-site")?.getAttribute("data-footer-open")).toBe("true");
  expect(el.querySelector("[data-home-page]")?.hasAttribute("inert")).toBe(true);
  expect(el.querySelector("#home-footer-content")?.hasAttribute("inert")).toBe(false);
  await act(async () => footerToggle.click());
  expect(el.querySelector(".home-site")?.getAttribute("data-footer-open")).toBe("false");
  expect(scrollport.scrollTop).toBe(200);
  scrollport.scrollTo = vi.fn();
  await act(async () => {
    el.querySelector<HTMLAnchorElement>(".scroll-cue")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  });
  expect(scrollport.scrollTo).toHaveBeenCalledWith({ top: 320, behavior: "smooth" });
  await act(async () => root.unmount());
  expect(disconnect).toHaveBeenCalled();
  expect(remove.mock.calls.some(([event]) => String(event) === "scroll")).toBe(true);
  remove.mockRestore();
});
