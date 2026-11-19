"use client";

import { useEffect, useRef, useState } from "react";

import { useSiteLocale } from "@/features/site/client/site-location";
/* oxlint-disable react/iframe-missing-sandbox -- Reddit's official embed requires allow-scripts and allow-same-origin together. */
import * as m from "@/paraglide/messages.js";

import { toRedditEmbedUrl } from "./embed-url";

export function RedditEmbed({ url }: { url?: string }) {
  const locale = useSiteLocale();
  const embedUrl = toRedditEmbedUrl(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(500);

  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow || typeof event.data !== "string")
        return;
      try {
        const message: unknown = JSON.parse(event.data);
        if (!message || typeof message !== "object") return;
        const type = Reflect.get(message, "type");
        const data = Reflect.get(message, "data");
        if (type === "resize.embed" && typeof data === "number") {
          setHeight(Math.max(120, data));
        }
      } catch {
        // Ignore messages from other iframe integrations.
      }
    };
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, []);

  if (!embedUrl) return null;

  return (
    <div className="cms-reddit-embed">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        lang={locale}
        title={m.article_reddit_embed({}, { locale })}
        height={height}
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups"
        allow="clipboard-read; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
