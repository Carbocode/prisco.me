import { describe, expect, it } from "vitest";

import type { CmsDocument } from "./cms-document";
import { estimateReadingTimeMinutes } from "./reading-time";

describe("estimateReadingTimeMinutes", () => {
  it("returns at least one minute for an empty document", () => {
    expect(estimateReadingTimeMinutes({ type: "doc" })).toBe(1);
  });

  it("rounds the estimate up using 200 words per minute", () => {
    const document: CmsDocument = {
      type: "doc",
      content: [
        { type: "p", children: [{ text: Array.from({ length: 201 }, () => "parola").join(" ") }] },
      ],
    };

    expect(estimateReadingTimeMinutes(document)).toBe(2);
  });

  it("counts text recursively and supports apostrophes", () => {
    const document: CmsDocument = {
      type: "doc",
      content: [
        {
          type: "blockquote",
          children: [{ type: "p", children: [{ text: "L'articolo contiene dell’altro testo." }] }],
        },
      ],
    };

    expect(estimateReadingTimeMinutes(document)).toBe(1);
  });
});
