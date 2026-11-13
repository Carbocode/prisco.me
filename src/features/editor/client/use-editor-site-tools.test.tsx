import { act, renderHook } from "@testing-library/react";
import { createPlateEditor } from "platejs/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import type { SiteTool } from "@/lib/webmcp";

import { useEditorSiteTools } from "./use-editor-site-tools";

const tools = new Map<string, SiteTool>();
function installRegistry() {
  Object.defineProperty(document, "modelContext", {
    configurable: true,
    value: {
      registerTool(tool: SiteTool, { signal }: { signal: AbortSignal }) {
        tools.set(tool.name, tool);
        signal.addEventListener("abort", () => tools.delete(tool.name), { once: true });
        return Promise.resolve();
      },
    },
  });
}
function call(name: string, args = {}) {
  const tool = tools.get(name);
  if (!tool) throw new Error(`Missing tool ${name}`);
  return tool.execute(args);
}
afterEach(() => {
  Reflect.deleteProperty(document, "modelContext");
  tools.clear();
});

describe("editor site tools", () => {
  it("reads live state, applies edits through Plate with undo, and unregisters on unmount", () => {
    installRegistry();
    const onChange = vi.fn();
    const editor = createPlateEditor({ value: [{ type: "p", children: [{ text: "Original" }] }] });
    const { unmount } = renderHook(() => useEditorSiteTools(editor, false, [], onChange));
    const before = editor.children;
    const result = z.object({ revision: z.string() }).parse(call("editor_read_blocks"));
    act(() => {
      call("editor_edit_blocks", {
        expectedRevision: result.revision,
        start: 0,
        deleteCount: 1,
        blocks: [{ type: "p", children: [{ text: "Updated" }] }],
      });
    });
    expect(editor.children[0].children[0].text).toBe("Updated");
    expect(onChange).toHaveBeenCalledWith({ type: "doc", content: editor.children });
    expect(() =>
      call("editor_edit_blocks", {
        expectedRevision: result.revision,
        start: 0,
        deleteCount: 0,
        blocks: [],
      }),
    ).toThrow("Document changed");
    act(() => editor.tf.undo());
    expect(editor.children).toEqual(before);
    unmount();
    expect(tools.size).toBe(0);
  });
  it("does not expose edits in read-only mode and tolerates unsupported browsers", () => {
    const onChange = vi.fn();
    const editor = createPlateEditor();
    const unsupported = renderHook(() => useEditorSiteTools(editor, false, [], onChange));
    unsupported.unmount();
    installRegistry();
    const supported = renderHook(() => useEditorSiteTools(editor, true, [], onChange));
    expect(tools.has("editor_read_blocks")).toBe(true);
    expect(tools.has("editor_edit_blocks")).toBe(false);
    supported.unmount();
  });
});
