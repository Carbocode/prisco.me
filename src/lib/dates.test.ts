import { expect, it } from "vitest";

import { formatSiteDate, siteDateParts } from "./dates";

it("uses the site's calendar date when the server and browser have different time zones", () => {
  const instant = new Date("2026-07-14T23:00:00Z");
  expect(siteDateParts(instant)).toEqual({ year: 2026, month: 7, day: 15 });
  expect(formatSiteDate(instant)).toBe("15/07/2026");
});

it("keeps publication years aligned across the New Year boundary", () => {
  expect(siteDateParts(new Date("2026-12-31T23:30:00Z")).year).toBe(2027);
});
