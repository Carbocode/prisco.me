import { describe, expect, it } from "vitest";

import { publicationDateParts } from "./publication-date";

describe("publicationDateParts", () => {
  it("usa il calendario Europe/Rome vicino alla mezzanotte", () => {
    expect(publicationDateParts(new Date("2026-07-14T22:30:00.000Z"))).toEqual({
      year: 2026,
      month: 7,
      day: 15,
    });
  });
});
