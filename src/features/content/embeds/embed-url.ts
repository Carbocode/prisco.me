/**
 * Converts a shareable media URL (YouTube, Vimeo, generic) into an embeddable
 * iframe URL. Returns null when the URL is not safe/embeddable.
 * Shared by the editor element and the public renderer.
 */
export function toEmbedUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.replace(/^www\./, "");

  const redditEmbed = toRedditEmbedUrl(value);
  if (redditEmbed) return redditEmbed;

  // YouTube
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = url.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
  }
  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
  }

  // Vimeo
  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
  }

  // Instagram posts and reels
  if (host === "instagram.com") {
    const match = url.pathname.match(/^\/(?:p|reel|tv)\/([\w-]+)/);
    if (match)
      return `https://www.instagram.com/p/${encodeURIComponent(match[1])}/embed/captioned/`;
  }

  // LinkedIn activity posts
  if (host === "linkedin.com") {
    const urn = url.pathname.match(/urn:li:(activity|share|ugcPost):(\d+)/);
    if (urn) return `https://www.linkedin.com/embed/feed/update/urn:li:${urn[1]}:${urn[2]}`;
    const activityId = url.pathname.match(/activity-(\d+)/)?.[1];
    if (activityId)
      return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityId}`;
  }

  // TikTok videos
  if (host === "tiktok.com" || host === "m.tiktok.com") {
    const id = url.pathname.match(/\/video\/(\d+)/)?.[1];
    if (id)
      return `https://www.tiktok.com/player/v1/${encodeURIComponent(id)}?description=1&music_info=1`;
  }

  // Spotify content
  if (host === "open.spotify.com") {
    const match = url.pathname.match(/^\/(album|artist|episode|playlist|show|track)\/([\w-]+)/);
    if (match)
      return `https://open.spotify.com/embed/${encodeURIComponent(match[1])}/${encodeURIComponent(match[2])}`;
  }

  // Facebook posts and videos use the official social plugin iframe. Profiles
  // are deliberately excluded because the post plugin cannot render them.
  if (host === "facebook.com" || host === "m.facebook.com" || host === "fb.watch") {
    const isPost =
      host === "fb.watch" ||
      /\/(?:posts|reel|videos)\//.test(url.pathname) ||
      ["/permalink.php", "/photo.php", "/story.php", "/watch/"].some((path) =>
        url.pathname.startsWith(path),
      );
    if (isPost)
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url.href)}&show_text=true&width=500`;
  }

  // Already an embed URL
  if (host === "youtube.com" || host === "player.vimeo.com" || host === "youtube-nocookie.com") {
    return value;
  }

  return null;
}

export function toPublicHttpUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

export function toTwitterPostUrl(value: unknown): string | null {
  const href = toPublicHttpUrl(value);
  if (!href) return null;
  const url = new URL(href);
  const host = url.hostname.replace(/^www\./, "");
  if (!["mobile.twitter.com", "twitter.com", "x.com"].includes(host)) return null;
  return /^\/[^/]+\/status\/\d+/.test(url.pathname) ? url.href : null;
}

export function toRedditEmbedUrl(value: unknown): string | null {
  const href = toPublicHttpUrl(value);
  if (!href) return null;
  const url = new URL(href);
  const host = url.hostname.replace(/^www\./, "");
  if (!["embed.reddit.com", "old.reddit.com", "reddit.com"].includes(host)) return null;
  const isRedditContent = /\/(?:r|user)\/[^/]+\/comments\/[\w]+(?:\/|$)/.test(url.pathname);
  if (!isRedditContent) return null;

  url.hostname = "embed.reddit.com";
  url.searchParams.set("embed", "true");
  url.searchParams.set("ref", "share");
  url.searchParams.set("ref_source", "embed");
  url.searchParams.set("utm_source", "embedv2");
  url.searchParams.set("utm_medium", "post_embed");
  url.searchParams.set("utm_name", "post_embed");
  url.searchParams.set("utm_term", "23");
  return url.href;
}

export function isSocialPostEmbed(value: unknown): boolean {
  const href = toPublicHttpUrl(value);
  if (!href) return false;
  const host = new URL(href).hostname.replace(/^www\./, "");
  return [
    "facebook.com",
    "fb.watch",
    "linkedin.com",
    "m.facebook.com",
    "old.reddit.com",
    "reddit.com",
    "redd.it",
  ].includes(host);
}

export function toPreviewImageUrl(value: unknown): string | null {
  if (typeof value === "string" && value.startsWith("/media/")) return value;
  return toPublicHttpUrl(value);
}

export type OpenGraphPreview = {
  title: string;
  description?: string;
  image?: string;
  siteName?: string;
};

export function openGraphPreview(value: unknown): OpenGraphPreview | undefined {
  if (!value || typeof value !== "object") return undefined;
  const title = Reflect.get(value, "title");
  const description = Reflect.get(value, "description");
  const image = Reflect.get(value, "image");
  const siteName = Reflect.get(value, "siteName");
  if (typeof title !== "string") return undefined;
  return {
    title,
    description: typeof description === "string" ? description : undefined,
    image: typeof image === "string" ? image : undefined,
    siteName: typeof siteName === "string" ? siteName : undefined,
  };
}
