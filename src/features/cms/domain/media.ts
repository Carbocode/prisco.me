export const MAX_MEDIA_BYTES = 5 * 1024 * 1024;
export const mediaTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;
export function mediaStorageKey(
  mimeType: keyof typeof mediaTypes,
  date = new Date(),
  uuid: string = crypto.randomUUID(),
) {
  return `cms/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${uuid}.${mediaTypes[mimeType]}`;
}
export function hasValidImageSignature(bytes: Uint8Array, mimeType: keyof typeof mediaTypes) {
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png")
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (value, index) => bytes[index] === value,
    );
  if (mimeType === "image/webp")
    return (
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
    );
  return (
    new TextDecoder().decode(bytes.slice(4, 12)).includes("ftypavif") ||
    new TextDecoder().decode(bytes.slice(4, 12)).includes("ftypavis")
  );
}
export function mediaUrl(baseUrl: string, storageKey: string) {
  return `${baseUrl.replace(/\/$/, "")}/${storageKey.split("/").map(encodeURIComponent).join("/")}`;
}
