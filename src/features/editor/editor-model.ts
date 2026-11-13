export function safeHref(value: string | undefined) {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    return ["http:", "https:", "mailto:"].includes(new URL(value).protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function mediaKind(mimeType: string): "audio" | "file" | "image" | "video" {
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  return "file";
}

export function mediaTypeLabel(type: "audio" | "file" | "image" | "video") {
  if (type === "audio") return "audio";
  if (type === "video") return "video";
  if (type === "file") return "file";
  return "immagine";
}

export function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}
