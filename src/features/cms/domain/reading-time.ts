import type { CmsDocument, CmsNode } from "./cms-document";

export const WORDS_PER_MINUTE = 200;

export function estimateReadingTimeMinutes(document: CmsDocument) {
  const text = (document.content ?? []).flatMap(textFragments).join(" ");
  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function textFragments(node: CmsNode): string[] {
  const ownText = typeof node.text === "string" ? [node.text] : [];
  const children = [...(node.children ?? []), ...(node.content ?? [])];

  return [...ownText, ...children.flatMap(textFragments)];
}
