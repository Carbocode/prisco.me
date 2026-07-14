import type { ReactNode } from "react";

import type { CmsDocument } from "../domain/cms-document";

type Node = Record<string, unknown> & {
  type?: string;
  content?: Node[];
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
};
export type CmsMediaView = { url: string; altText?: string | null; caption?: string | null };
function stringAttr(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function safeHref(value: unknown) {
  if (typeof value !== "string") return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    return ["http:", "https:", "mailto:"].includes(new URL(value).protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

function children(node: Node, media: Map<string, CmsMediaView>, key: string): ReactNode {
  if (node.type === "text") {
    let value: ReactNode = node.text ?? "";
    for (const [index, mark] of (node.marks ?? []).entries()) {
      if (mark.type === "bold") value = <strong key={`${key}-b-${index}`}>{value}</strong>;
      else if (mark.type === "italic") value = <em key={`${key}-i-${index}`}>{value}</em>;
      else if (mark.type === "strike") value = <s key={`${key}-s-${index}`}>{value}</s>;
      else if (mark.type === "link") {
        const href = safeHref(mark.attrs?.href);
        if (href)
          value = (
            <a
              key={`${key}-a-${index}`}
              href={href}
              rel={href.startsWith("/") ? undefined : "noopener noreferrer"}
            >
              {value}
            </a>
          );
      }
    }
    return value;
  }
  const nested = node.content?.map((item, index) => children(item, media, `${key}-${index}`));
  switch (node.type) {
    case "paragraph":
      return <p key={key}>{nested}</p>;
    case "heading":
      return node.attrs?.level === 3 ? <h3 key={key}>{nested}</h3> : <h2 key={key}>{nested}</h2>;
    case "bulletList":
      return <ul key={key}>{nested}</ul>;
    case "orderedList":
      return <ol key={key}>{nested}</ol>;
    case "listItem":
      return <li key={key}>{nested}</li>;
    case "blockquote":
      return <blockquote key={key}>{nested}</blockquote>;
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "mediaImage": {
      const item = media.get(stringAttr(node.attrs?.mediaId) ?? "");
      if (!item) return null;
      return (
        <figure key={key}>
          <img src={item.url} alt={stringAttr(node.attrs?.alt) ?? item.altText ?? ""} />
          {(stringAttr(node.attrs?.caption) ?? item.caption) ? (
            <figcaption>{stringAttr(node.attrs?.caption) ?? item.caption}</figcaption>
          ) : null}
        </figure>
      );
    }
    default:
      return null;
  }
}

export function renderCmsDocument(document: CmsDocument, media = new Map<string, CmsMediaView>()) {
  return document.content?.map((node, index) => children(node, media, `cms-${index}`)) ?? null;
}
