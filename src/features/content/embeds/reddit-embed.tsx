"use client";

/* oxlint-disable react/iframe-missing-sandbox -- Reddit's official embed requires allow-scripts and allow-same-origin together. */

import { useEffect, useRef, useState } from "react";

import { toRedditEmbedUrl } from "./embed-url";

export function RedditEmbed({ url }: { url?: string }) {
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
        title="Contenuto Reddit incorporato"
        height={height}
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups"
        allow="clipboard-read; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
