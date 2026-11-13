import { DndPlugin } from "@platejs/dnd";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ParagraphPlugin, Plate, PlateContent, createPlateEditor } from "platejs/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";

import { BlockDraggable } from "./block-draggable";

// The insertion catalogue loads optional math rendering CSS; these tests exercise block actions.
vi.mock("../insert-items", () => ({ INSERT_GROUPS: [], TURN_INTO_GROUPS: [] }));

function mountEditor(readOnly = false) {
  const editor = createPlateEditor({
    plugins: [
      ParagraphPlugin,
      DndPlugin.configure({
        render: {
          aboveNodes: BlockDraggable,
          aboveSlate: ({ children }) => (
            <DndProvider backend={HTML5Backend}>{children}</DndProvider>
          ),
        },
      }),
    ],
    value: [{ type: "p", children: [{ text: "Testo originale" }] }],
  });
  render(
    <TooltipProvider>
      <Plate editor={editor} readOnly={readOnly}>
        <PlateContent />
      </Plate>
    </TooltipProvider>,
  );
  return editor;
}

afterEach(cleanup);

describe("block controls", () => {
  it("opens actions with a normal click, duplicates the target block and preserves undo", async () => {
    const editor = mountEditor();
    const original = structuredClone(editor.children);
    fireEvent.click(screen.getByRole("button", { name: "Azioni blocco" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "Duplica blocco" }));
    await waitFor(() => expect(editor.children).toHaveLength(2));
    expect(editor.api.string([1])).toBe("Testo originale");
    act(() => editor.tf.undo());
    expect(editor.children).toEqual(original);
  });

  it("opens the menu from the keyboard", async () => {
    mountEditor();
    const trigger = screen.getByRole("button", { name: "Azioni blocco" });
    act(() => trigger.focus());
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(await screen.findByRole("menuitem", { name: "Elimina blocco" })).toBeDefined();
  });

  it("does not offer editing controls in read-only mode", () => {
    mountEditor(true);
    expect(screen.queryByRole("button", { name: "Azioni blocco" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Trascina il blocco" })).toBeNull();
  });
});
