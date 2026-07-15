export const MAX_MEDIA_BYTES = 5 * 1024 * 1024;
export const mediaTypes = {
  "image/webp": "webp",
  "video/webm": "webm",
  "audio/webm": "webm",
} as const;

export function mediaStorageKey(
  mimeType: keyof typeof mediaTypes,
  date = new Date(),
  uuid: string = crypto.randomUUID(),
) {
  return `cms/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${uuid}.${mediaTypes[mimeType]}`;
}

export function hasValidMediaSignature(bytes: Uint8Array, mimeType: keyof typeof mediaTypes) {
  if (mimeType === "image/webp") {
    return (
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
    );
  }
  return [0x1a, 0x45, 0xdf, 0xa3].every((value, index) => bytes[index] === value);
}

export function mediaUrl(baseUrl: string, storageKey: string) {
  return `${baseUrl.replace(/\/$/, "")}/${storageKey.split("/").map(encodeURIComponent).join("/")}`;
}
