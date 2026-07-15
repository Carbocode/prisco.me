import { z } from "zod";

export type CmsNode = Record<string, unknown> & {
  type?: string;
  children?: CmsNode[];
  content?: CmsNode[];
  text?: string;
};
export type CmsDocument = { type: "doc"; content?: CmsNode[] };
export type CmsPlateValue = CmsNode[];
export const CURRENT_CONTENT_VERSION = 2;
export const EMPTY_CMS_DOCUMENT: CmsDocument = {
  type: "doc",
  content: [{ type: "p", children: [{ text: "" }] }],
};

export const cmsDocumentSchema = z
  .object({
    type: z.literal("doc"),
    content: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .refine(
    (document) => new TextEncoder().encode(JSON.stringify(document)).byteLength <= 512 * 1024,
    {
      message: "Il contenuto supera 512 KiB",
    },
  );

export function serializeCmsDocument(document: CmsDocument) {
  return JSON.stringify(cmsDocumentSchema.parse(document));
}

export function parseCmsDocument(value: string): CmsDocument {
  return cmsDocumentSchema.parse(JSON.parse(value) as unknown);
}

export function fromPlateValue(value: CmsPlateValue): CmsDocument {
  return { type: "doc", content: value.length ? value : EMPTY_CMS_DOCUMENT.content };
}

export function toPlateValue(document: CmsDocument): CmsPlateValue {
  const nodes = document.content ?? [];
  if (nodes.every((node) => Array.isArray(node.children))) {
    return nodes.length ? nodes : (EMPTY_CMS_DOCUMENT.content ?? []);
  }
  const value = migrateBlocks(nodes);
  return value.length ? value : (EMPTY_CMS_DOCUMENT.content ?? []);
}

function migrateBlocks(nodes: CmsNode[], list?: { indent: number; type: string }): CmsNode[] {
  return nodes.flatMap((node): CmsNode[] => {
    const attrs = asRecord(node.attrs);
    const listProps = list ? { indent: list.indent, listStyleType: list.type } : {};
    if (node.type === "paragraph") {
      return [{ type: "p", children: migrateInline(node.content), ...align(attrs), ...listProps }];
    }
    if (node.type === "heading") {
      const level = attrs.level === 1 ? 1 : attrs.level === 3 ? 3 : attrs.level === 4 ? 4 : 2;
      return [
        {
          type: `h${level}`,
          children: migrateInline(node.content),
          ...align(attrs),
          ...listProps,
        },
      ];
    }
    return migrateSpecialBlock(node, attrs, list);
  });
}

function migrateSpecialBlock(
  node: CmsNode,
  attrs: Record<string, unknown>,
  list?: { indent: number; type: string },
): CmsNode[] {
  if (["bulletList", "orderedList", "taskList"].includes(node.type ?? "")) {
    const type =
      node.type === "orderedList" ? "decimal" : node.type === "taskList" ? "todo" : "disc";
    return migrateBlocks(node.content ?? [], { indent: (list?.indent ?? 0) + 1, type });
  }
  if (node.type === "listItem" || node.type === "taskItem") {
    const current = list ?? { indent: 1, type: node.type === "taskItem" ? "todo" : "disc" };
    const blocks = migrateBlocks(node.content ?? [], current);
    if (node.type === "taskItem" && blocks[0]) blocks[0].checked = attrs.checked === true;
    return blocks;
  }
  if (node.type === "blockquote") {
    return [{ type: "blockquote", children: migrateInlineOrBlocks(node.content) }];
  }
  if (node.type === "codeBlock") {
    return [
      {
        type: "code_block",
        children: textContent(node)
          .split("\n")
          .map((line) => ({ type: "code_line", children: [{ text: line }] })),
      },
    ];
  }
  if (node.type === "horizontalRule") return [{ type: "hr", children: [{ text: "" }] }];
  return migrateStructuredBlock(node, attrs);
}

function migrateStructuredBlock(node: CmsNode, attrs: Record<string, unknown>): CmsNode[] {
  const mapped = {
    table: "table",
    tableRow: "tr",
    tableHeader: "th",
    tableCell: "td",
  }[node.type ?? ""];
  if (mapped) return [{ type: mapped, children: migrateBlocks(node.content ?? []) }];
  if (node.type === "mediaImage") {
    return [
      {
        type: "mediaImage",
        mediaId: attrs.mediaId,
        alt: attrs.alt,
        caption: attrs.caption,
        children: [{ text: "" }],
      },
    ];
  }
  return [];
}

function migrateInlineOrBlocks(nodes: CmsNode[] | undefined) {
  if (!nodes?.length) return [{ text: "" }];
  return nodes.every((node) => node.type === "text" || node.type === "hardBreak")
    ? migrateInline(nodes)
    : migrateBlocks(nodes);
}

function migrateInline(nodes: CmsNode[] | undefined): CmsNode[] {
  const value = (nodes ?? []).flatMap((node): CmsNode[] => {
    if (node.type === "hardBreak") return [{ text: "\n" }];
    if (node.type !== "text") return [];
    const leaf: CmsNode = { text: node.text ?? "" };
    let link: Record<string, unknown> | undefined;
    for (const rawMark of Array.isArray(node.marks) ? node.marks : []) {
      const mark = asRecord(rawMark);
      const type = mark.type === "strike" ? "strikethrough" : mark.type;
      if (
        ["bold", "italic", "code", "underline", "highlight", "superscript", "subscript"].includes(
          String(type),
        )
      )
        leaf[String(type)] = true;
      if (mark.type === "link") link = asRecord(mark.attrs);
    }
    return link && typeof link.href === "string"
      ? [{ type: "a", url: link.href, target: link.target, children: [leaf] }]
      : [leaf];
  });
  return value.length ? value : [{ text: "" }];
}

function align(attrs: Record<string, unknown>) {
  return ["left", "center", "right", "justify"].includes(String(attrs.textAlign))
    ? { textAlign: attrs.textAlign }
    : {};
}

function textContent(node: CmsNode): string {
  return node.type === "text" ? (node.text ?? "") : (node.content ?? []).map(textContent).join("");
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? Object.fromEntries(Object.entries(value)) : {};
}
