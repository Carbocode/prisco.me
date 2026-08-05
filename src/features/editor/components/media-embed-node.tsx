"use client";

import type { TElement } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";

import { EmbedPreview } from "@/features/editor/embed-preview";
import {
  isSocialPostEmbed,
  openGraphPreview,
  toEmbedUrl,
  toRedditEmbedUrl,
  toTwitterPostUrl,
} from "@/features/editor/embed-url";
import { RedditEmbed } from "@/features/editor/reddit-embed";
import { TwitterEmbed } from "@/features/editor/twitter-embed";
import { cn } from "@/lib/utils";

export function MediaEmbedElement(props: PlateElementProps) {
  const element = props.element as TElement & { url?: string };
  const embedUrl = toEmbedUrl(element.url);
  const redditUrl = toRedditEmbedUrl(element.url);
  const twitterUrl = toTwitterPostUrl(element.url);

  return (
    <PlateElement {...props} className="cms-editor__embed">
      <div contentEditable={false}>
        {redditUrl ? (
          <RedditEmbed url={redditUrl} />
        ) : twitterUrl ? (
          <TwitterEmbed url={twitterUrl} />
        ) : embedUrl ? (
          <div className={cn("cms-embed", isSocialPostEmbed(element.url) && "cms-embed--social")}>
            {/* oxlint-disable-next-line react/iframe-missing-sandbox -- URLs are restricted to trusted providers; social widgets do not work in a sandbox. */}
            <iframe
              src={embedUrl}
              title="Contenuto incorporato"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
