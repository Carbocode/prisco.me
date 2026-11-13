import { describe, expect, it } from "vitest";

import type { CmsNode } from "@/features/content/domain/document";

import { documentRevision, editAgentBlocks, editBlocksSchema } from "./agent-document";
import { agentWidgets } from "./agent-widgets";

const nodes: CmsNode[] = [{ type: "p", children: [{ text: "Original" }] }];
const edit = (blocks: CmsNode[], overrides = {}) =>
  editAgentBlocks(
    nodes,
    editBlocksSchema.parse({
      expectedRevision: documentRevision(nodes),
      start: 0,
      deleteCount: 1,
      blocks,
      ...overrides,
    }),
    new Set(["USE_ID_FROM_EDITOR_LIST_MEDIA"]),
  );

describe("agent document edits", () => {
  it("accepts every widget example and preserves unrelated nodes on insertion", () => {
    for (const { example } of agentWidgets) expect(edit([example])[0]).toEqual(example);
    expect(
      edit([{ type: "h1", children: [{ text: "Heading" }] }], { start: 1, deleteCount: 0 })[0],
    ).toEqual(nodes[0]);
    expect(nodes[0].children?.[0].text).toBe("Original");
  });
  it("rejects stale revisions and invalid ranges", () => {
    expect(() => edit([], { expectedRevision: "stale" })).toThrow("Document changed");
    expect(() => edit([], { start: 2 })).toThrow("out of bounds");
  });
  it("rejects unknown blocks, unsafe links, malformed trees and unknown media", () => {
    expect(() => edit([{ type: "script", children: [{ text: "" }] }])).toThrow();
    expect(() =>
      edit([
        {
          type: "p",
          children: [{ type: "a", url: "javascript:alert(1)", children: [{ text: "x" }] }],
        },
      ]),
    ).toThrow();
    expect(() => edit([{ type: "equation", children: [{ text: "" }] }])).toThrow();
    expect(() => edit([{ type: "table", children: [{ text: "x" }] }])).toThrow();
    expect(() =>
      edit([{ type: "p", children: [{ type: "p", children: [{ text: "x" }] }] }]),
    ).toThrow();
    expect(() =>
      edit([
        { type: "mediaImage", mediaId: "missing", mediaType: "image", children: [{ text: "" }] },
      ]),
    ).toThrow("mediaId");
  });
  it("retains an editable paragraph after deleting everything and bounds document size", () => {
    expect(edit([])).toEqual([{ type: "p", children: [{ text: "" }] }]);
    expect(() => edit([{ type: "p", children: [{ text: "a".repeat(512 * 1024) }] }])).toThrow();
  });
});
