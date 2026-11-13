import type { CmsNode } from "@/features/content/domain/document";

const leaf = [{ text: "" }];
const paragraph = { type: "p", children: [{ text: "Testo" }] };

/** Examples use the exact node names consumed by Plate and the public renderer. */
export const agentWidgets: { name: string; example: CmsNode }[] = [
  {
    name: "Paragraph and formatted text",
    example: { type: "p", children: [{ text: "Testo", bold: true }] },
  },
  ...["h1", "h2", "h3", "h4", "toggle"].map((type) => ({
    name: type,
    example: { type, children: [{ text: "Titolo" }] },
  })),
  ...["disc", "decimal", "todo"].map((listStyleType) => ({
    name: `${listStyleType} list item`,
    example: { ...paragraph, indent: 1, listStyleType },
  })),
  ...["blockquote", "callout"].map((type) => ({
    name: type,
    example: { type, children: [paragraph] },
  })),
  {
    name: "Code",
    example: {
      type: "code_block",
      lang: "javascript",
      children: [{ type: "code_line", children: [{ text: "const x = 1;" }] }],
    },
  },
  {
    name: "Table",
    example: {
      type: "table",
      children: [{ type: "tr", children: [{ type: "td", children: [paragraph] }] }],
    },
  },
  {
    name: "Columns",
    example: {
      type: "column_group",
      children: [
        { type: "column", width: "50%", children: [paragraph] },
        { type: "column", width: "50%", children: [paragraph] },
      ],
    },
  },
  ...["hr", "toc"].map((type) => ({ name: type, example: { type, children: leaf } })),
  {
    name: "Equation (inline_equation inside paragraphs)",
    example: { type: "equation", texExpression: "x^2", children: leaf },
  },
  {
    name: "Link inside a paragraph",
    example: {
      type: "p",
      children: [{ type: "a", url: "https://example.com", children: [{ text: "Link" }] }],
    },
  },
  {
    name: "Date inside a paragraph",
    example: { type: "p", children: [{ type: "date", date: "2026-01-01", children: leaf }] },
  },
  {
    name: "Mention inside a paragraph",
    example: { type: "p", children: [{ type: "mention", value: "Nome", children: leaf }] },
  },
  {
    name: "Library image, video, audio or file",
    example: {
      type: "mediaImage",
      mediaType: "image",
      mediaId: "USE_ID_FROM_EDITOR_LIST_MEDIA",
      alt: "Descrizione",
      children: leaf,
    },
  },
  {
    name: "Embed",
    example: {
      type: "mediaEmbed",
      url: "https://www.youtube.com/watch?v=VIDEO_ID",
      children: leaf,
    },
  },
  {
    name: "Drawing",
    example: {
      type: "code_drawing",
      data: { code: "graph TD; A-->B", drawingType: "Mermaid", drawingMode: "Both" },
      children: leaf,
    },
  },
];
