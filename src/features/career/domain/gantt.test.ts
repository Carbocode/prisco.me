import { expect, it } from "vitest";

import { getGanttMonthIndexForDate } from "./gantt";

it("computes the current marker from the request date instead of Worker initialization", () => {
  expect(getGanttMonthIndexForDate(new Date("2026-11-13T10:00:00Z"))).toBe(82);
  expect(getGanttMonthIndexForDate(new Date("2026-11-30T23:30:00Z"))).toBe(83);
});
