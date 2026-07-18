import { describe, expect, it } from "vitest";

import type { CmsDocument } from "./cms-document";
import { countMediaInDocument, removeMediaFromDocument } from "./media-associations";

const document: CmsDocument = {
  type: "doc",
  content: [
    { type: "p", children: [{ text: "Prima" }] },
    { type: "mediaImage", mediaId: "media-a", children: [{ text: "" }] },
    {
      type: "column_group",
      children: [
        {
          type: "column",
          children: [
            {
              type: "mediaImage",
              attrs: { mediaId: "media-a" },
              children: [{ text: "" }],
            },
            { type: "mediaImage", mediaId: "media-b", children: [{ text: "" }] },
          ],
        },
      ],
    },
  ],
};

describe("media associations", () => {
  it("counts every media occurrence in nested documents", () => {
    expect(countMediaInDocument(document, "media-a")).toBe(2);
    expect(countMediaInDocument(document, "media-b")).toBe(1);
    expect(countMediaInDocument(document, "missing")).toBe(0);
  });

  it("removes matching media nodes while preserving the rest of the document", () => {
    const result = removeMediaFromDocument(document, "media-a");

    expect(countMediaInDocument(result, "media-a")).toBe(0);
    expect(countMediaInDocument(result, "media-b")).toBe(1);
    expect(result.content?.[0]).toEqual(document.content?.[0]);
  });

  it("does not mutate the original document", () => {
    removeMediaFromDocument(document, "media-a");
    expect(countMediaInDocument(document, "media-a")).toBe(2);
  });
});
