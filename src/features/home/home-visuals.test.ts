import { readFileSync } from "node:fs";

import { parse } from "postcss";
import type { Document } from "postcss";
import { expect, it } from "vitest";

const css = parse(readFileSync("src/features/home/home.css", "utf8"));
function declarations(selector: string) {
  const result: Record<string, string> = {};
  css.walkRules((rule) => {
    let parent: typeof rule.parent | Document = rule.parent;
    while (parent) {
      if (parent.type === "atrule" && "name" in parent && parent.name === "media") return;
      parent = parent.parent;
    }
    if (rule.selectors.includes(selector))
      rule.walkDecls((decl) => {
        result[decl.prop] = decl.value;
      });
  });
  return result;
}
it("collega gli effetti ai nomi delle classi generati dalle costellazioni", () => {
  for (const name of [
    "sky-glint",
    "sky-burst",
    "sky-dust.is-twinkling",
    "pulse",
    "tw-bounce",
    "tw-shadow",
  ]) {
    expect(Object.keys(declarations(`.home-traversata .${name}`)).length).toBeGreaterThan(0);
  }
  expect(declarations(".home-traversata .sky-glint").animation).toContain("home-sky-glint");
  expect(declarations(".home-traversata .sky-dust.is-twinkling").animation).toContain(
    "home-sky-dust",
  );
  expect(declarations(".home-traversata .sky-star:hover .sky-burst").animation).toContain(
    "home-sky-burst",
  );
});
it("mantiene ingresso e scintillio delle stelle del prototipo", () => {
  const animation = declarations(".home-traversata.js .star img").animation;
  expect(animation).toContain("home-star-in 720ms");
  expect(animation).toContain("home-twinkle var(--tw, 5s)");
  expect(animation).toContain("calc(var(--in, 0ms) + 720ms) infinite");
});
it("lascia al pulsante primario il proprio colore di testo", () => {
  expect(declarations(".home-traversata .btn-primary").color).toBe("var(--night-0)");
  expect(declarations('.home-traversata a:not([data-slot="button"])').color).toBeUndefined();
  expect(declarations(".home-traversata a").color).toBeUndefined();
});

it("mostra l’indicatore anche senza un breakpoint desktop e non aggiunge un bordo inferiore", () => {
  expect(declarations(".home-page.has-home-motion .gauge").display).toBe("block");
});

it("disegna la cornice sopra lo scroller animando soltanto transform", () => {
  expect(declarations(".home-page.is-framed")).toEqual({});
  expect(declarations(".home-page").padding).toBeUndefined();
  expect(declarations(".home-viewport").transition).toBeUndefined();
  expect(declarations(".home-frame > span").transition).toBe(
    "transform var(--frame-time) var(--frame-ease)",
  );
  expect(declarations(".home-frame").top).toBeUndefined();
  expect(declarations(".home-frame")["pointer-events"]).toBe("none");
  // The peek stays visible until it has slid away, so no black gap opens behind it.
  expect(declarations(".home-page:not(.is-framed) + .home-footer").transition).toContain(
    "visibility 0s var(--frame-time)",
  );
  expect(declarations(".home-page .gauge").transition).not.toMatch(/\b(left|top) /);
});
