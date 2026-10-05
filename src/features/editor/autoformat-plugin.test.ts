import { createPlateEditor } from "platejs/react";
import { describe, expect, it } from "vitest";

import { autoformatBoldPlugin, autoformatH1Plugin, autoformatPlugin } from "./autoformat-plugin";

function typeInEditor(text: string) {
  const editor = createPlateEditor({
    plugins: [autoformatH1Plugin, autoformatBoldPlugin, autoformatPlugin],
    value: [{ type: "p", children: [{ text: "" }] }],
  });
  editor.tf.select({ path: [0, 0], offset: 0 });
  for (const character of text) editor.tf.insertText(character);
  return editor;
}

describe("CMS editor autoformat", () => {
  it("formats Markdown marks on their owning plugins", () => {
    const editor = typeInEditor("**bold**");
    expect(editor.children).toEqual([{ type: "p", children: [{ text: "bold", bold: true }] }]);
  });

  it("turns a heading shortcut into a heading block", () => {
    const editor = typeInEditor("# Heading");
    expect(editor.children[0]).toMatchObject({ type: "h1", children: [{ text: "Heading" }] });
  });

  it("applies a text substitution", () => {
    const editor = typeInEditor("->");
    expect(editor.children).toEqual([{ type: "p", children: [{ text: "→" }] }]);
  });
});
