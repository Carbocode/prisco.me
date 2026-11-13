import { renderToString } from "katex";

import { type Node } from "@/features/content/rendering/render-types";

export function katexHtml(tex: unknown, displayMode: boolean): string {
  if (typeof tex !== "string" || tex.length === 0) return "";
  try {
    return renderToString(tex, {
      displayMode,
      output: "htmlAndMathml",
      throwOnError: false,
    });
  } catch {
    return "";
  }
}

export function stringAttr(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

export function mediaWidth(value: unknown) {
  if (typeof value === "number" && value >= 120) return `${value}px`;
  if (typeof value !== "string" || !/^\d{1,3}(?:\.\d+)?%$/.test(value)) return undefined;
  const percentage = Number.parseFloat(value);
  return percentage > 0 && percentage <= 100 ? value : undefined;
}

export function safeHref(value: unknown) {
  if (typeof value !== "string") return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    return ["http:", "https:", "mailto:"].includes(new URL(value).protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function textAlignment(value: unknown) {
  return value === "left" || value === "center" || value === "right" || value === "justify"
    ? value
    : undefined;
}

export function blockLineHeight(node: Node) {
  const value = Number(node.lineHeight);
  return [1, 1.2, 1.5, 2, 3].includes(value) ? value : undefined;
}

export function nodeText(node: Node): string {
  if (typeof node.text === "string") return node.text;
  return (node.children ?? node.content ?? []).map(nodeText).join("");
}

export function headingSlug(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "sezione"
  );
}

export function safeColor(value: unknown) {
  return typeof value === "string" && /^#[\da-f]{6}$/i.test(value) ? value : undefined;
}
