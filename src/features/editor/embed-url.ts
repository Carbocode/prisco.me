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
