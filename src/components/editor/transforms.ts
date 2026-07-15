"use client";

import { toggleCodeBlock } from "@platejs/code-block";
import { toggleList } from "@platejs/list";
import { KEYS, type TElement } from "platejs";
import type { PlateEditor } from "platejs/react";

const listTypes = new Set<string>([KEYS.ul, KEYS.ol, KEYS.listTodo]);

export function setBlockType(editor: PlateEditor, type: string) {
  if (listTypes.has(type)) {
    toggleList(editor, { listStyleType: type });
    editor.tf.focus();
    return;
  }

  if (type === KEYS.codeBlock) {
    toggleCodeBlock(editor);
    editor.tf.focus();
    return;
  }

  editor.tf.setNodes({ type });
  editor.tf.unsetNodes(["checked", "indent", "listStyleType"]);
  editor.tf.focus();
}

export function getBlockType(block: TElement) {
  if (typeof block.listStyleType === "string") return block.listStyleType;
  return block.type;
}
