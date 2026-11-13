// oxlint-disable-next-line import/no-unassigned-import -- Public equations require the KaTeX stylesheet.
import "katex/dist/katex.min.css";
import type { ReactNode } from "react";

import { toPlateValue, type CmsDocument } from "@/features/content/domain/document";
import { EmbedPreview } from "@/features/content/embeds/embed-preview";
import {
  isSocialPostEmbed,
  openGraphPreview,
  toEmbedUrl,
  toRedditEmbedUrl,
  toTwitterPostUrl,
} from "@/features/content/embeds/embed-url";
import { RedditEmbed } from "@/features/content/embeds/reddit-embed";
import { TwitterEmbed } from "@/features/content/embeds/twitter-embed";
import { CmsCodeDrawing } from "@/features/content/rendering/code-drawing";
import {
  safeColor,
  safeHref,
  textAlignment,
  blockLineHeight,
  stringAttr,
  nodeText,
  katexHtml,
  mediaWidth,
  headingSlug,
} from "@/features/content/rendering/node-attributes";
import {
  type Node,
  type CmsMediaView,
  type TocHeading,
} from "@/features/content/rendering/render-types";
import { cn } from "@/lib/utils";

export function children(
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
            "--dynamic-color": safeColor(node.color),
            "--dynamic-background-color": safeColor(node.backgroundColor),
          }}
          className="dynamic-color dynamic-background-color"
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
      const content = (
        <p
          style={{
            "--cms-text-align": textAlignment(node.textAlign),
            "--cms-line-height": blockLineHeight(node),
          }}
        >
          {nested}
        </p>
      );
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
        <p
          key={key}
          style={{
            "--cms-text-align": textAlignment(node.textAlign),
            "--cms-line-height": blockLineHeight(node),
          }}
        >
          {nested}
        </p>
      );
    }
    case "h1":
      return (
        <h2
          key={key}
          id={stringAttr(node.id)}
          style={{
            "--cms-text-align": textAlignment(node.textAlign),
            "--cms-line-height": blockLineHeight(node),
          }}
        >
          {nested}
        </h2>
      );
    case "h2":
      return (
        <h3
          key={key}
          id={stringAttr(node.id)}
          style={{
            "--cms-text-align": textAlignment(node.textAlign),
            "--cms-line-height": blockLineHeight(node),
          }}
        >
          {nested}
        </h3>
      );
    case "h3":
      return (
        <h4
          key={key}
          id={stringAttr(node.id)}
          style={{
            "--cms-text-align": textAlignment(node.textAlign),
            "--cms-line-height": blockLineHeight(node),
          }}
        >
          {nested}
        </h4>
      );
    case "h4":
      return (
        <h5
          key={key}
          id={stringAttr(node.id)}
          style={{
            "--cms-text-align": textAlignment(node.textAlign),
            "--cms-line-height": blockLineHeight(node),
          }}
        >
          {nested}
        </h5>
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
        <details
          key={key}
          open
          className="cms-toggle"
          style={{
            "--cms-text-align": textAlignment(node.textAlign),
            "--cms-line-height": blockLineHeight(node),
          }}
        >
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
        <p key={key} style={{ "--cms-text-align": textAlignment(node.attrs?.textAlign) }}>
          {nested}
        </p>
      );
    case "heading": {
      const align = textAlignment(node.attrs?.textAlign);
      if (node.attrs?.level === 4)
        return (
          <h4 key={key} style={{ "--cms-text-align": align }}>
            {nested}
          </h4>
        );
      if (node.attrs?.level === 3)
        return (
          <h3 key={key} style={{ "--cms-text-align": align }}>
            {nested}
          </h3>
        );
      return (
        <h2 key={key} style={{ "--cms-text-align": align }}>
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
        <div
          key={key}
          className="cms-callout"
          style={{
            "--cms-text-align": textAlignment(node.textAlign),
            "--cms-line-height": blockLineHeight(node),
          }}
        >
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
          className="cms-column w-(--cms-column-width)"
          style={{ "--cms-column-width": typeof node.width === "string" ? node.width : undefined }}
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
      const redditUrl = toRedditEmbedUrl(node.url);
      if (redditUrl) return <RedditEmbed key={key} url={redditUrl} />;
      const twitterUrl = toTwitterPostUrl(node.url);
      if (twitterUrl) return <TwitterEmbed key={key} url={twitterUrl} />;
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
        <div
          key={key}
          className={cn("cms-embed", isSocialPostEmbed(node.url) && "cms-embed--social")}
        >
          {/* oxlint-disable-next-line react/iframe-missing-sandbox -- URLs are restricted to trusted providers; social widgets do not work in a sandbox. */}
          <iframe
            src={embedUrl}
            title="Contenuto incorporato"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    case "code_drawing": {
      const data = node.data && typeof node.data === "object" ? node.data : undefined;
      const drawingCode = stringAttr(data && Reflect.get(data, "code")) ?? "";
      if (!drawingCode) return null;
      const drawingMode = stringAttr(data && Reflect.get(data, "drawingMode")) ?? "Both";
      if (drawingMode === "Code")
        return (
          <pre key={key}>
            <code>{drawingCode}</code>
          </pre>
        );
      return (
        <CmsCodeDrawing
          key={key}
          code={drawingCode}
          drawingType={stringAttr(data && Reflect.get(data, "drawingType")) ?? "Mermaid"}
        />
      );
    }
    case "mediaImage": {
      const item = media.get(stringAttr(node.mediaId) ?? stringAttr(node.attrs?.mediaId) ?? "");
      if (!item) return null;
      const mediaType = stringAttr(node.mediaType) ?? stringAttr(node.attrs?.mediaType) ?? "image";
      const width = mediaWidth(node.width ?? node.attrs?.width);
      return (
        <figure
          key={key}
          className={cn(width && "mx-auto w-(--cms-media-width)")}
          style={{ "--cms-media-width": width }}
        >
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
      depth: (Number(node.type?.slice(1)) || 1) + 1,
      id: String(node.id),
      title: nodeText(node),
    }));
  return value.map((node, index) => children(node, media, `cms-${index}`, headings));
}
