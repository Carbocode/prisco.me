"use client";

import {
  AudioLines,
  Braces,
  CalendarIcon,
  ChevronsUpDown,
  Columns3,
  FileUp,
  Film,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Lightbulb,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Radical,
  Table as TableIcon,
  TableOfContents,
  Video,
  Workflow,
} from "lucide-react";
import { KEYS } from "platejs";
import type { PlateEditor } from "platejs/react";
import type * as React from "react";

import type { MediaKind } from "@/features/editor/editor-actions-context";
import { insertBlock, insertInlineElement, setBlockType } from "@/features/editor/transforms";

export type InsertContext = {
  editor: PlateEditor;
  onMedia: (type: MediaKind) => void;
  onEmbed: () => void;
};

export type InsertItemDef = {
  icon: React.ReactNode;
  label: string;
  keywords?: string[];
  run: (ctx: InsertContext) => void;
  /** Convert the current block into this type. Absent → not offered in "Turn into". */
  turnInto?: (ctx: InsertContext) => void;
};

export type InsertGroupDef = { group: string; items: InsertItemDef[] };

const blockItem = (
  type: string,
  icon: React.ReactNode,
  label: string,
  keywords?: string[],
): InsertItemDef => ({
  icon,
  label,
  keywords,
  run: (ctx) => insertBlock(ctx.editor, type, { upsert: true }),
  turnInto: (ctx) => setBlockType(ctx.editor, type),
});

const advancedItem = (
  type: string,
  icon: React.ReactNode,
  label: string,
  keywords?: string[],
): InsertItemDef => ({
  icon,
  label,
  keywords,
  run: (ctx) => insertBlock(ctx.editor, type, { upsert: true }),
});

const mediaItem = (
  kind: MediaKind,
  icon: React.ReactNode,
  label: string,
  keywords?: string[],
): InsertItemDef => ({
  icon,
  label,
  keywords,
  run: (ctx) => ctx.onMedia(kind),
});

const inlineItem = (
  type: string,
  icon: React.ReactNode,
  label: string,
  keywords?: string[],
): InsertItemDef => ({
  icon,
  label,
  keywords,
  run: (ctx) => insertInlineElement(ctx.editor, type),
});

export const INSERT_GROUPS: InsertGroupDef[] = [
  {
    group: "Base",
    items: [
      blockItem(KEYS.p, <Pilcrow />, "Testo", ["paragrafo", "text"]),
      blockItem(KEYS.h1, <Heading1 />, "Titolo 1", ["h1", "titolo"]),
      blockItem(KEYS.h2, <Heading2 />, "Titolo 2", ["h2", "sottotitolo"]),
      blockItem(KEYS.h3, <Heading3 />, "Titolo 3", ["h3", "sottotitolo"]),
      blockItem(KEYS.blockquote, <Quote />, "Citazione", ["blockquote", "quote", ">"]),
      blockItem(KEYS.codeBlock, <Braces />, "Blocco di codice", ["code", "```"]),
      blockItem(KEYS.callout, <Lightbulb />, "Callout", ["nota", "avviso"]),
      blockItem(KEYS.toggle, <ChevronsUpDown />, "Blocco espandibile", ["toggle", "collassabile"]),
      advancedItem(KEYS.hr, <Minus />, "Separatore", ["hr", "divider", "---"]),
    ],
  },
  {
    group: "Elenchi",
    items: [
      blockItem(KEYS.ul, <List />, "Elenco puntato", ["ul", "bullet", "-"]),
      blockItem(KEYS.ol, <ListOrdered />, "Elenco numerato", ["ol", "1."]),
      blockItem(KEYS.listTodo, <ListChecks />, "Elenco attività", [
        "todo",
        "task",
        "checkbox",
        "[]",
      ]),
    ],
  },
  {
    group: "Avanzati",
    items: [
      advancedItem(KEYS.table, <TableIcon />, "Tabella", ["table"]),
      advancedItem("action_three_columns", <Columns3 />, "3 colonne", ["columns", "layout"]),
      advancedItem(KEYS.equation, <Radical />, "Equazione", ["math", "katex", "formula"]),
      advancedItem(KEYS.codeDrawing, <Workflow />, "Diagramma", [
        "mermaid",
        "plantuml",
        "graphviz",
        "flowchart",
      ]),
      advancedItem(KEYS.toc, <TableOfContents />, "Indice", ["toc"]),
    ],
  },
  {
    group: "Media",
    items: [
      mediaItem("image", <ImagePlus />, "Immagine", ["image", "foto"]),
      mediaItem("video", <Video />, "Video", ["video"]),
      mediaItem("audio", <AudioLines />, "Audio", ["audio"]),
      mediaItem("file", <FileUp />, "File", ["file", "allegato"]),
      {
        icon: <Film />,
        label: "Embed",
        keywords: ["link", "youtube", "vimeo", "open graph", "incorpora"],
        run: (ctx) => ctx.onEmbed(),
      },
    ],
  },
  {
    group: "Inline",
    items: [
      inlineItem(KEYS.link, <Link2 />, "Link", ["collegamento", "url"]),
      inlineItem(KEYS.date, <CalendarIcon />, "Data", ["date"]),
      inlineItem(KEYS.inlineEquation, <Radical />, "Equazione inline", ["math inline"]),
    ],
  },
];

/** Groups offered in the block "Turn into" submenu (excludes Advanced, embed, and Inline). */
export const TURN_INTO_GROUPS: InsertGroupDef[] = INSERT_GROUPS.map((group) => ({
  group: group.group,
  items: group.items.filter((item) => item.turnInto),
})).filter((group) => group.items.length > 0);
