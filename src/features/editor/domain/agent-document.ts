import { z } from "zod";

import { cmsDocumentSchema, type CmsNode } from "@/features/content/domain/document";
import { safeHref } from "@/features/editor/editor-model";

const text = z.strictObject({
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
  code: z.boolean().optional(),
  highlight: z.boolean().optional(),
  superscript: z.boolean().optional(),
  subscript: z.boolean().optional(),
  kbd: z.boolean().optional(),
  color: z.string().max(100).optional(),
  backgroundColor: z.string().max(100).optional(),
});
const childNodes = (): z.ZodType<CmsNode[]> => z.array(agentNodeSchema).min(1).max(1000);
const url = z
  .string()
  .max(2048)
  .refine((value) => Boolean(safeHref(value)), "Unsafe URL");
const voidChildren = z.tuple([z.strictObject({ text: z.literal("") })]);

export const agentNodeSchema: z.ZodType<CmsNode> = z.lazy(() =>
  z.union([
    text,
    z.strictObject({
      type: z.enum([
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "blockquote",
        "callout",
        "toggle",
        "code_line",
        "code_syntax",
        "table",
        "tr",
        "td",
        "th",
        "column_group",
        "column",
      ]),
      children: childNodes(),
      id: z.string().max(100).optional(),
      textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
      lineHeight: z.number().min(1).max(3).optional(),
      indent: z.int().min(1).max(10).optional(),
      listStyleType: z.enum(["disc", "decimal", "todo"]).optional(),
      checked: z.boolean().optional(),
      icon: z.string().max(32).optional(),
      backgroundColor: z.string().max(100).optional(),
      width: z
        .string()
        .regex(/^\d+(\.\d+)?%$/)
        .optional(),
    }),
    z.strictObject({
      type: z.literal("code_block"),
      lang: z.string().max(50).optional(),
      children: childNodes(),
    }),
    z.strictObject({ type: z.literal("a"), url, children: childNodes() }),
    z.strictObject({ type: z.enum(["hr", "toc"]), children: voidChildren }),
    z.strictObject({
      type: z.enum(["equation", "inline_equation"]),
      texExpression: z.string().max(20000),
      children: voidChildren,
    }),
    z.strictObject({ type: z.literal("date"), date: z.string().max(100), children: voidChildren }),
    z.strictObject({
      type: z.literal("mention"),
      value: z.string().max(200),
      children: voidChildren,
    }),
    z.strictObject({
      type: z.literal("mediaImage"),
      mediaId: z.string(),
      mediaType: z.enum(["image", "audio", "video", "file"]),
      alt: z.string().max(1000).optional(),
      caption: z.string().max(2000).optional(),
      children: voidChildren,
    }),
    z.strictObject({
      type: z.literal("mediaEmbed"),
      url: z.url().refine((value) => ["http:", "https:"].includes(new URL(value).protocol)),
      children: voidChildren,
    }),
    z.strictObject({
      type: z.literal("code_drawing"),
      data: z.strictObject({
        code: z.string().max(50000),
        drawingType: z.enum(["Mermaid", "PlantUML"]),
        drawingMode: z.enum(["Both", "Code", "Preview"]),
      }),
      children: voidChildren,
    }),
  ]),
);

export const readBlocksSchema = z.strictObject({
  start: z.int().min(0).default(0),
  limit: z.int().min(1).max(50).default(10),
});
export const editBlocksSchema = z.strictObject({
  expectedRevision: z.string(),
  start: z.int().min(0),
  deleteCount: z.int().min(0),
  blocks: z.array(agentNodeSchema).max(100),
});

export function documentRevision(nodes: CmsNode[]) {
  let hash = 2166136261;
  const value = JSON.stringify(nodes);
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}

/** Validate tree shape before Plate normalizes it; do not accept partial/legacy nodes. */
function validateTree(node: CmsNode, parent?: string, depth = 0) {
  if (depth > 20) throw new Error("Document nesting exceeds 20 levels");
  if (typeof node.text === "string") {
    if (
      !parent ||
      ["table", "tr", "column_group", "column", "code_block", "blockquote", "callout"].includes(
        parent,
      )
    )
      throw new Error("Text requires a text block");
    return;
  }
  const type = node.type ?? "";
  const inlineTypes = ["a", "date", "mention", "inline_equation"];
  const textBlocks = ["p", "h1", "h2", "h3", "h4", "toggle", "code_line", "code_syntax", "a"];
  if (!parent && inlineTypes.includes(type)) throw new Error("Inline nodes require a text block");
  if (
    parent &&
    textBlocks.includes(parent) &&
    !inlineTypes.includes(type) &&
    !(parent === "code_line" && type === "code_syntax")
  )
    throw new Error("Text blocks cannot contain block nodes");
  if (parent && !textBlocks.includes(parent) && inlineTypes.includes(type))
    throw new Error("Inline nodes require a text block");
  const requiredParent: Record<string, string[]> = {
    tr: ["table"],
    td: ["tr"],
    th: ["tr"],
    column: ["column_group"],
    code_line: ["code_block"],
    code_syntax: ["code_line"],
  };
  if (requiredParent[type] && !requiredParent[type].includes(parent ?? ""))
    throw new Error(`Invalid parent for ${type}`);
  const requiredChildren: Record<string, string[]> = {
    table: ["tr"],
    tr: ["td", "th"],
    column_group: ["column"],
    code_block: ["code_line"],
  };
  for (const child of node.children ?? []) {
    if (requiredChildren[type] && !requiredChildren[type].includes(child.type ?? ""))
      throw new Error(`Invalid child for ${type}`);
    validateTree(child, type, depth + 1);
  }
}

export function editAgentBlocks(
  nodes: CmsNode[],
  input: z.output<typeof editBlocksSchema>,
  mediaIds: Set<string>,
) {
  if (documentRevision(nodes) !== input.expectedRevision)
    throw new Error("Document changed. Read the blocks again before editing.");
  if (input.start > nodes.length || input.start + input.deleteCount > nodes.length)
    throw new Error("Block range is out of bounds");
  const blocks = z.array(agentNodeSchema).parse(input.blocks);
  function validateMedia(node: CmsNode) {
    if (node.type === "mediaImage" && !mediaIds.has(String(node.mediaId)))
      throw new Error("Choose a mediaId from editor_list_media");
    node.children?.forEach(validateMedia);
  }
  for (const block of blocks) {
    validateTree(block);
    validateMedia(block);
  }
  const next = [...nodes];
  next.splice(input.start, input.deleteCount, ...blocks);
  if (!next.length) next.push({ type: "p", children: [{ text: "" }] });
  cmsDocumentSchema.parse({ type: "doc", content: next });
  return next;
}
