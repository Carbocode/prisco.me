import { expect, it } from "vitest";

import { careerExcerpt } from "./career-excerpt";
it("limita la lunghezza rispettando le parole", () => {
  const text = "Questa è una esperienza professionale completa";
  const preview = careerExcerpt(text, 25);
  expect(preview).toBe("Questa è una esperienza…");
  expect(preview.length).toBeLessThanOrEqual(25);
});
it("mantiene integralmente i testi brevi", () => {
  expect(careerExcerpt("Esperienza breve")).toBe("Esperienza breve");
});
