"use client";

/* oxlint-disable react/iframe-missing-sandbox -- trusted YouTube/Vimeo embeds validated by toEmbedUrl need scripts + same-origin to play. */

import type { TElement } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";

import { EmbedPreview } from "@/features/editor/embed-preview";
import { openGraphPreview, toEmbedUrl } from "@/features/editor/embed-url";

export function MediaEmbedElement(props: PlateElementProps) {
  const element = props.element as TElement & { url?: string };
  const embedUrl = toEmbedUrl(element.url);

  return (
    <PlateElement {...props} className="cms-editor__embed">
      <div contentEditable={false}>
        {embedUrl ? (
          <div className="cms-embed">
            <iframe
              src={embedUrl}
              title="Contenuto incorporato"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              allowFullScreen
            />
          </div>
        ) : (
          <EmbedPreview url={element.url} metadata={openGraphPreview(element.metadata)} />
        )}
      </div>
      {props.children}
    </PlateElement>
  );
}
