"use client";

import { useEffect, useRef } from "react";

import { toTwitterPostUrl } from "./embed-url";

const SCRIPT_ID = "twitter-widgets-script";
const SCRIPT_SRC = "https://platform.twitter.com/widgets.js";

type TwitterWindow = Window & {
  twttr?: { widgets?: { load: (element?: HTMLElement) => void } };
};

export function TwitterEmbed({ url }: { url?: string }) {
  const postUrl = toTwitterPostUrl(url);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!postUrl) return () => undefined;

    const loadWidget = () => {
      const twitter = window as TwitterWindow;
      twitter.twttr?.widgets?.load(containerRef.current ?? undefined);
    };
    const existing = document.querySelector<HTMLScriptElement>(`#${SCRIPT_ID}`);
    if (existing) {
      if ((window as TwitterWindow).twttr?.widgets) loadWidget();
      else existing.addEventListener("load", loadWidget, { once: true });
      return () => existing.removeEventListener("load", loadWidget);
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", loadWidget, { once: true });
    document.head.appendChild(script);
    return () => script.removeEventListener("load", loadWidget);
  }, [postUrl]);

  if (!postUrl) return null;

  return (
    <div ref={containerRef} className="cms-twitter-embed">
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={postUrl} target="_blank" rel="noreferrer">
          Visualizza il post su X
        </a>
      </blockquote>
    </div>
  );
}
