/* oxlint-disable react/iframe-missing-sandbox -- trusted YouTube/Vimeo embeds validated by toEmbedUrl need scripts + same-origin to play. */
import { renderToString } from "katex";

// oxlint-disable-next-line import/no-unassigned-import -- KaTeX stylesheet for server-rendered equations.
import "katex/dist/katex.min.css";
import type { CSSProperties, ReactNode } from "react";

import { EmbedPreview } from "../../editor/embed-preview";
import { openGraphPreview, toEmbedUrl } from "../../editor/embed-url";
import { toPlateValue, type CmsDocument } from "../domain/cms-document";

function katexHtml(tex: unknown, displayMode: boolean): string {
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

type Node = Record<string, unknown> & {
  type?: string;
  children?: Node[];
  content?: Node[];
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
};
export type CmsMediaView = { url: string; altText?: string | null; caption?: string | null };
function stringAttr(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function mediaWidth(value: unknown) {
  if (typeof value === "number" && value >= 120) return `${value}px`;
  if (typeof value !== "string" || !/^\d{1,3}(?:\.\d+)?%$/.test(value)) return undefined;
  const percentage = Number.parseFloat(value);
  return percentage > 0 && percentage <= 100 ? value : undefined;
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

function alignmentStyle(value: unknown): CSSProperties | undefined {
  if (value === "left") return { textAlign: "left" };
  if (value === "center") return { textAlign: "center" };
  if (value === "right") return { textAlign: "right" };
  if (value === "justify") return { textAlign: "justify" };
  return undefined;
}

function blockStyle(node: Node): CSSProperties | undefined {
  const style = alignmentStyle(node.textAlign) ?? {};
  if ([1, 1.2, 1.5, 2, 3].includes(Number(node.lineHeight))) {
    style.lineHeight = Number(node.lineHeight);
  }
  return Object.keys(style).length ? style : undefined;
}

type TocHeading = { depth: number; id: string; title: string };

function children(
  node: Node,
  media: Map<string, CmsMediaView>,
  key: string,
  headings: TocHeading[] = [],
): ReactNode {
  if (typeof node.text === "string") {
    let value: ReactNode = node.text ?? "";
    if (node.bold === true) value = <strong key={`${key}-bold`}>{value}</strong>;
    if (node.italic === true) value = <em key={`${key}-italic`}>{value}</em>;
    if (node.strikethrough === true) value = <s key={`${key}-strike`}>{value}</s>;
    if (node.code === true) value = <code key={`${key}-code`}>{value}</code>;
    if (node.underline === true) value = <u key={`${key}-underline`}>{value}</u>;
    if (node.highlight === true) value = <mark key={`${key}-highlight`}>{value}</mark>;
    if (node.superscript === true) value = <sup key={`${key}-sup`}>{value}</sup>;
    if (node.subscript === true) value = <sub key={`${key}-sub`}>{value}</sub>;
    if (node.kbd === true) value = <kbd key={`${key}-kbd`}>{value}</kbd>;
    if (typeof node.color === "string" || typeof node.backgroundColor === "string") {
      value = (
        <span
          key={`${key}-color`}
          style={{
            color: safeColor(node.color),
            backgroundColor: safeColor(node.backgroundColor),
          }}
        >
          {value}
        </span>
      );
    }
    for (const [index, mark] of (node.marks ?? []).entries()) {
      if (mark.type === "bold") value = <strong key={`${key}-b-${index}`}>{value}</strong>;
      else if (mark.type === "italic") value = <em key={`${key}-i-${index}`}>{value}</em>;
      else if (mark.type === "strike") value = <s key={`${key}-s-${index}`}>{value}</s>;
      else if (mark.type === "code") value = <code key={`${key}-c-${index}`}>{value}</code>;
      else if (mark.type === "underline") value = <u key={`${key}-u-${index}`}>{value}</u>;
      else if (mark.type === "highlight") value = <mark key={`${key}-h-${index}`}>{value}</mark>;
      else if (mark.type === "superscript") value = <sup key={`${key}-sup-${index}`}>{value}</sup>;
      else if (mark.type === "subscript") value = <sub key={`${key}-sub-${index}`}>{value}</sub>;
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
  const nested = (node.children ?? node.content)?.map((item, index) =>
    children(item, media, `${key}-${index}`, headings),
  );
  switch (node.type) {
    case "a": {
      const href = safeHref(node.url);
      if (!href) return nested;
      return (
        <a key={key} href={href} rel={href.startsWith("/") ? undefined : "noopener noreferrer"}>
          {nested}
        </a>
      );
    }
    case "p": {
      const content = <p style={blockStyle(node)}>{nested}</p>;
      if (node.listStyleType === "todo") {
        const checked = node.checked === true;
        return (
          <div key={key} className="cms-task-list-item" data-checked={checked}>
            <input type="checkbox" checked={checked} readOnly aria-label="Attività" />
            {content}
          </div>
        );
      }
      if (node.listStyleType === "decimal")
        return (
          <ol key={key}>
            <li>{content}</li>
          </ol>
        );
      if (node.listStyleType === "disc")
        return (
          <ul key={key}>
            <li>{content}</li>
          </ul>
        );
      return (
        <p key={key} style={blockStyle(node)}>
          {nested}
        </p>
      );
    }
    case "h1":
      return (
        <h1 key={key} id={stringAttr(node.id)} style={blockStyle(node)}>
          {nested}
        </h1>
      );
    case "h2":
      return (
        <h2 key={key} id={stringAttr(node.id)} style={blockStyle(node)}>
          {nested}
        </h2>
      );
    case "h3":
      return (
        <h3 key={key} id={stringAttr(node.id)} style={blockStyle(node)}>
          {nested}
        </h3>
      );
    case "h4":
      return (
        <h4 key={key} id={stringAttr(node.id)} style={blockStyle(node)}>
          {nested}
        </h4>
      );
    case "code_block":
      return (
        <pre key={key}>
          <code>{nodeText(node)}</code>
        </pre>
      );
    case "code_line":
      return (
        <span key={key}>
          {nested}
          {"\n"}
        </span>
      );
    case "hr":
      return <hr key={key} />;
    case "toc":
      return (
        <nav key={key} aria-label="Indice del contenuto" className="cms-content-toc">
          <strong>In questa pagina</strong>
          <ul>
            {headings.map((heading) => (
              <li key={heading.id} data-depth={heading.depth}>
                <a href={`#${heading.id}`}>{heading.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      );
    case "toggle":
      return (
        <details key={key} open className="cms-toggle" style={blockStyle(node)}>
          <summary className="cms-toggle__title">{nested}</summary>
        </details>
      );
    case "tr":
      return <tr key={key}>{nested}</tr>;
    case "th":
      return (
        <th key={key} scope="col">
          {nested}
        </th>
      );
    case "td":
      return <td key={key}>{nested}</td>;
    case "paragraph":
      return (
        <p key={key} style={alignmentStyle(node.attrs?.textAlign)}>
          {nested}
        </p>
      );
    case "heading": {
      const style = alignmentStyle(node.attrs?.textAlign);
      if (node.attrs?.level === 4)
        return (
          <h4 key={key} style={style}>
            {nested}
          </h4>
        );
      if (node.attrs?.level === 3)
        return (
          <h3 key={key} style={style}>
            {nested}
          </h3>
        );
      return (
        <h2 key={key} style={style}>
          {nested}
        </h2>
      );
    }
    case "bulletList":
      return <ul key={key}>{nested}</ul>;
    case "orderedList":
      return <ol key={key}>{nested}</ol>;
    case "listItem":
      return <li key={key}>{nested}</li>;
    case "taskList":
      return (
        <ul key={key} className="cms-task-list">
          {nested}
        </ul>
      );
    case "taskItem": {
      const checked = node.attrs?.checked === true;
      return (
        <li key={key} data-checked={checked}>
          <input
            type="checkbox"
            checked={checked}
            readOnly
            aria-label={checked ? "Attività completata" : "Attività da completare"}
          />
          <div>{nested}</div>
        </li>
      );
    }
    case "blockquote":
      return <blockquote key={key}>{nested}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{nested}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "table":
      return (
        <div key={key} className="cms-content-table">
          <table>
            <tbody>{nested}</tbody>
          </table>
        </div>
      );
    case "tableRow":
      return <tr key={key}>{nested}</tr>;
    case "tableHeader":
      return (
        <th key={key} scope="col">
          {nested}
        </th>
      );
    case "tableCell":
      return <td key={key}>{nested}</td>;
    case "callout":
      return (
        <div key={key} className="cms-callout" style={blockStyle(node)}>
          <span className="cms-callout__icon" aria-hidden="true">
            {stringAttr(node.icon) ?? "💡"}
          </span>
          <div className="cms-callout__body">{nested}</div>
        </div>
      );
    case "column_group":
      return (
        <div key={key} className="cms-columns">
          {nested}
        </div>
      );
    case "column":
      return (
        <div
          key={key}
          className="cms-column"
          style={typeof node.width === "string" ? { width: node.width } : undefined}
        >
          {nested}
        </div>
      );
    case "equation":
      return (
        <div
          key={key}
          className="cms-equation"
          // oxlint-disable-next-line react/no-danger -- KaTeX output is generated from stored TeX, not user HTML.
          dangerouslySetInnerHTML={{ __html: katexHtml(node.texExpression, true) }}
        />
      );
    case "inline_equation":
      return (
        <span
          key={key}
          className="cms-equation cms-equation--inline"
          // oxlint-disable-next-line react/no-danger -- KaTeX output is generated from stored TeX, not user HTML.
          dangerouslySetInnerHTML={{ __html: katexHtml(node.texExpression, false) }}
        />
      );
    case "date":
      return (
        <span key={key} className="cms-date">
          {stringAttr(node.date) ?? stringAttr(node.rawDate) ?? ""}
          {nested}
        </span>
      );
    case "mention":
      return (
        <span key={key} className="cms-mention">
          @{stringAttr(node.value) ?? ""}
          {nested}
        </span>
      );
    case "mediaEmbed": {
      const embedUrl = toEmbedUrl(node.url);
      if (!embedUrl) {
        return (
          <EmbedPreview
            key={key}
            url={stringAttr(node.url)}
            metadata={openGraphPreview(node.metadata)}
          />
        );
      }
      return (
        <div key={key} className="cms-embed">
          <iframe
            src={embedUrl}
            title="Contenuto incorporato"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            allowFullScreen
          />
        </div>
      );
    }
    case "code_drawing": {
      const data = node.data && typeof node.data === "object" ? node.data : undefined;
      const drawingCode = stringAttr(data && Reflect.get(data, "code")) ?? "";
      if (!drawingCode) return null;
      return (
        <pre
          key={key}
          className="cms-code-drawing"
          data-drawing-type={stringAttr(data && Reflect.get(data, "drawingType"))}
        >
          <code>{drawingCode}</code>
        </pre>
      );
    }
    case "mediaImage": {
      const item = media.get(stringAttr(node.mediaId) ?? stringAttr(node.attrs?.mediaId) ?? "");
      if (!item) return null;
      const mediaType = stringAttr(node.mediaType) ?? stringAttr(node.attrs?.mediaType) ?? "image";
      const width = mediaWidth(node.width ?? node.attrs?.width);
      return (
        <figure key={key} style={width ? { marginInline: "auto", width } : undefined}>
          {mediaType === "image" ? (
            <img
              src={item.url}
              alt={stringAttr(node.alt) ?? stringAttr(node.attrs?.alt) ?? item.altText ?? ""}
            />
          ) : null}
          {mediaType === "video" ? (
            <video src={item.url} controls>
              <track kind="captions" />
            </video>
          ) : null}
          {mediaType === "audio" ? (
            <audio src={item.url} controls>
              <track kind="captions" />
            </audio>
          ) : null}
          {mediaType === "file" ? <a href={item.url}>Apri allegato</a> : null}
          {(stringAttr(node.caption) ?? stringAttr(node.attrs?.caption) ?? item.caption) ? (
            <figcaption>
              {stringAttr(node.caption) ?? stringAttr(node.attrs?.caption) ?? item.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    default:
      return null;
  }
}

export function renderCmsDocument(document: CmsDocument, media = new Map<string, CmsMediaView>()) {
  const value = toPlateValue(document).map((node, index) => {
    if (!["h1", "h2", "h3", "h4"].includes(node.type ?? "") || typeof node.id === "string")
      return node;
    return { ...node, id: `${headingSlug(nodeText(node))}-${index}` };
  });
  const headings = value
    .filter((node) => ["h1", "h2", "h3", "h4"].includes(node.type ?? ""))
    .map((node) => ({
      depth: Number(node.type?.slice(1)) || 2,
      id: String(node.id),
      title: nodeText(node),
    }));
  return value.map((node, index) => children(node, media, `cms-${index}`, headings));
}

function nodeText(node: Node): string {
  if (typeof node.text === "string") return node.text;
  return (node.children ?? node.content ?? []).map(nodeText).join("");
}

function headingSlug(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "sezione"
  );
}

function safeColor(value: unknown) {
  return typeof value === "string" && /^#[\da-f]{6}$/i.test(value) ? value : undefined;
}
