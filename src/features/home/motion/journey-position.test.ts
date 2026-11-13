import { expect, it } from "vitest";

import { remapJourneyScroll } from "./journey-position";

it("mantiene la tappa mentre il frame si chiude e si riapre", () => {
  const expanded = { start: 1800, distance: 2400 };
  const framed = { start: 1660, distance: 2424 };
  const before = 3000;
  const after = remapJourneyScroll(before, expanded, framed);
  expect(after).toBe(2872);
  expect(remapJourneyScroll(after, framed, expanded)).toBe(before);
});
it("mantiene lo scroll verso l’alto durante il ridimensionamento", () => {
  const previous = { start: 1800, distance: 2400 };
  const next = { start: 1660, distance: 2424 };
  const after = remapJourneyScroll(2960, previous, next);
  expect((after - next.start) / next.distance).toBeCloseTo(
    (2960 - previous.start) / previous.distance,
  );
});
it("non sposta le altre sezioni o il percorso statico", () => {
  expect(
    remapJourneyScroll(500, { start: 1800, distance: 2400 }, { start: 1660, distance: 2424 }),
  ).toBe(500);
  expect(
    remapJourneyScroll(4500, { start: 1800, distance: 2400 }, { start: 1660, distance: 2424 }),
  ).toBe(4500);
  expect(remapJourneyScroll(500, { start: 0, distance: 0 }, { start: 0, distance: 0 })).toBe(500);
});
