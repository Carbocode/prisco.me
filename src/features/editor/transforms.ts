"use client";

import { insertCallout } from "@platejs/callout";
import { insertCodeBlock, toggleCodeBlock } from "@platejs/code-block";
import { insertCodeDrawing } from "@platejs/code-drawing";
import { insertDate } from "@platejs/date";
import { insertColumnGroup, toggleColumnGroup } from "@platejs/layout";
import { triggerFloatingLink } from "@platejs/link/react";
import { toggleList } from "@platejs/list";
import { insertEquation, insertInlineEquation } from "@platejs/math";
import { TablePlugin } from "@platejs/table/react";
import { insertToc } from "@platejs/toc";
import { KEYS, type Path, PathApi } from "platejs";
import type { PlateEditor } from "platejs/react";

const listTypes = new Set<string>([KEYS.ul, KEYS.ol, KEYS.listTodo]);

const insertList = (editor: PlateEditor, type: string) => {
  editor.tf.insertNodes(editor.api.create.block({ indent: 1, listStyleType: type }), {
    select: true,
  });
};

const createBlockquote = (editor: PlateEditor) => ({
  children: [editor.api.create.block({ type: KEYS.p })],
  type: KEYS.blockquote,
});

const selectBlockquoteStart = (editor: PlateEditor, path: Path) => {
  const start = editor.api.start(path.concat([0]));
  if (start) editor.tf.select(start);
};

const insertBlockMap: Record<string, (editor: PlateEditor, type: string) => void> = {
  [KEYS.listTodo]: insertList,
  [KEYS.ol]: insertList,
  [KEYS.ul]: insertList,
  action_three_columns: (editor) => insertColumnGroup(editor, { columns: 3, select: true }),
  [KEYS.callout]: (editor) => insertCallout(editor, { select: true }),
  [KEYS.codeBlock]: (editor) => insertCodeBlock(editor, { select: true }),
  [KEYS.codeDrawing]: (editor) => insertCodeDrawing(editor, {}, { select: true }),
  [KEYS.equation]: (editor) => insertEquation(editor, { select: true }),
  [KEYS.hr]: (editor) =>
    editor.tf.insertNodes(
      { type: KEYS.hr, children: [{ text: "" }] },
      { at: PathApi.next(editor.api.block()![1]), select: true },
    ),
  [KEYS.table]: (editor) => editor.getTransforms(TablePlugin).insert.table({}, { select: true }),
  [KEYS.toc]: (editor) => insertToc(editor, { select: true }),
  [KEYS.toggle]: (editor) =>
    editor.tf.insertNodes(editor.api.create.block({ type: KEYS.toggle }), {
      at: PathApi.next(editor.api.block()![1]),
      select: true,
    }),
};

const insertInlineMap: Record<string, (editor: PlateEditor, type: string) => void> = {
  [KEYS.date]: (editor) => insertDate(editor, { select: true }),
  [KEYS.inlineEquation]: (editor) => insertInlineEquation(editor, "", { select: true }),
  [KEYS.link]: (editor) => triggerFloatingLink(editor, { focused: true }),
};

type InsertBlockOptions = { upsert?: boolean };

export function insertBlock(editor: PlateEditor, type: string, options: InsertBlockOptions = {}) {
  const { upsert = false } = options;

  editor.tf.withoutNormalizing(() => {
    const block = editor.api.block();
    if (!block) return;

    const [currentNode, path] = block;
    const isCurrentBlockEmpty = editor.api.isEmpty(currentNode);
    const currentBlockType = getBlockType(currentNode);
    const isSameBlockType = type === currentBlockType;

    if (upsert && isCurrentBlockEmpty && isSameBlockType) return;

    if (type === KEYS.blockquote) {
      const insertPath = PathApi.next(path);
      editor.tf.insertNodes(createBlockquote(editor), { at: insertPath });
      if (!isSameBlockType && isCurrentBlockEmpty) editor.tf.removeNodes({ at: path });
      selectBlockquoteStart(editor, isCurrentBlockEmpty && !isSameBlockType ? path : insertPath);
      return;
    }

    if (type in insertBlockMap) {
      insertBlockMap[type](editor, type);
    } else {
      editor.tf.insertNodes(editor.api.create.block({ type }), {
        at: PathApi.next(path),
        select: true,
      });
    }

    if (!isSameBlockType) editor.tf.removeNodes({ previousEmptyBlock: true });
  });
}

export function insertInlineElement(editor: PlateEditor, type: string) {
  insertInlineMap[type]?.(editor, type);
}

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
  if (type === "action_three_columns") {
    toggleColumnGroup(editor, { columns: 3 });
    editor.tf.focus();
    return;
  }
  editor.tf.setNodes({ type });
  editor.tf.unsetNodes(["checked", "indent", "listStyleType"]);
  editor.tf.focus();
}

export function getBlockType(block: unknown) {
  if (!block || typeof block !== "object") return KEYS.p;
  const listStyleType = Reflect.get(block, "listStyleType");
  if (typeof listStyleType === "string") return listStyleType;
  const type = Reflect.get(block, "type");
  return typeof type === "string" ? type : KEYS.p;
}
