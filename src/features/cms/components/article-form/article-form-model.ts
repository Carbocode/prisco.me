import { slugPattern } from "@/features/cms/domain/slug";

export const articleStatusLabels: Record<string, string> = {
  archived: "Archiviato",
  draft: "Bozza",
  published: "Pubblicato",
  scheduled: "Programmato",
};

export function validateArticleInput({
  title,
  slug,
  categoryIds,
  projectSortOrder,
}: {
  title: string;
  slug: string;
  categoryIds: string[];
  projectSortOrder: number;
}) {
  if (title.trim().length < 3) return "Il titolo deve contenere almeno 3 caratteri.";
  if (!slugPattern.test(slug) || /^\d+$/.test(slug))
    return "Lo slug deve contenere solo lettere minuscole, numeri e trattini.";
  if (["authors", "categories", "tags"].includes(slug)) return "Questo slug è riservato.";
  if (!categoryIds.length) return "Seleziona una categoria prima di salvare.";
  if (!Number.isInteger(projectSortOrder) || projectSortOrder < -10000 || projectSortOrder > 10000)
    return "L’ordine del progetto deve essere un numero intero tra -10000 e 10000.";
  return null;
}

export function articleSaveError(error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  if (detail.includes("modified elsewhere") || detail.includes("CONTENT_VERSION_CONFLICT")) {
    return {
      type: "conflict" as const,
      text: "L’articolo è stato modificato altrove. Ricarica la pagina prima di salvare.",
    };
  }
  if (detail.includes("Slug already in use") || detail.includes("SLUG_CONFLICT")) {
    return { type: "error" as const, text: "Lo slug è già utilizzato da un altro articolo." };
  }
  return {
    type: "error" as const,
    text: detail && detail !== "[object Object]" ? detail : "Salvataggio non riuscito.",
  };
}

export function localDateTime(value: Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
