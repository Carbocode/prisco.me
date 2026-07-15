"use client";

import {
  Baseline,
  Bold,
  Code2,
  Highlighter,
  Italic,
  PaintBucket,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorReadOnly } from "platejs/react";

import { FontColorToolbarButton } from "./font-color-toolbar-button";
import { LinkToolbarButton } from "./link-toolbar-button";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ToolbarGroup } from "./toolbar";

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  if (readOnly) return null;

  return (
    <>
      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.bold} tooltip="Grassetto">
          <Bold />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.italic} tooltip="Corsivo">
          <Italic />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.underline} tooltip="Sottolineato">
          <Underline />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.strikethrough} tooltip="Barrato">
          <Strikethrough />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.code} tooltip="Codice inline">
          <Code2 />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.sup} clear={KEYS.sub} tooltip="Apice">
          <Superscript />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.sub} clear={KEYS.sup} tooltip="Pedice">
          <Subscript />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Evidenzia">
          <Highlighter />
        </MarkToolbarButton>
        <FontColorToolbarButton nodeType={KEYS.color} tooltip="Colore testo">
          <Baseline />
        </FontColorToolbarButton>
        <FontColorToolbarButton nodeType={KEYS.backgroundColor} tooltip="Colore sfondo">
          <PaintBucket />
        </FontColorToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <LinkToolbarButton />
      </ToolbarGroup>
    </>
  );
}
