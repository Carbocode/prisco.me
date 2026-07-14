export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180)
    .replace(/-$/g, "");
}

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
