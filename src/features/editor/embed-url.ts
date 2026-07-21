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
