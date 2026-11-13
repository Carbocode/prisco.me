/** Bound card previews before applying the responsive four-line visual limit. */
export function careerExcerpt(text: string, maxLength = 320): string {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) return normalized;
  const preview = normalized.slice(0, maxLength - 1);
  const lastSpace = preview.lastIndexOf(" ");
  return `${preview.slice(0, lastSpace > 0 ? lastSpace : preview.length).trimEnd()}…`;
}
