import { BlockquotePlugin, H1Plugin } from "@platejs/basic-nodes/react";
import { createPlateEditor } from "platejs/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@platejs/math", () => ({
  insertEquation: vi.fn(),
  insertInlineEquation: vi.fn(),
}));

import { setBlockType } from "./transforms";

describe("editor block transformations", () => {
  it("wraps the selected paragraph with the blockquote plugin", () => {
    const editor = createPlateEditor({
      plugins: [BlockquotePlugin, H1Plugin],
      value: [{ type: "p", children: [{ text: "A citation" }] }],
    });
    editor.tf.select({ path: [0, 0], offset: 3 });

    setBlockType(editor, "blockquote");

    expect(editor.children).toEqual([
      {
        type: "blockquote",
        children: [{ type: "p", children: [{ text: "A citation" }] }],
      },
    ]);

    setBlockType(editor, "blockquote");
    expect(editor.children).toEqual([{ type: "p", children: [{ text: "A citation" }] }]);

    setBlockType(editor, "blockquote");
    setBlockType(editor, "h1");
    expect(editor.children).toEqual([{ type: "h1", children: [{ text: "A citation" }] }]);
  });
});
