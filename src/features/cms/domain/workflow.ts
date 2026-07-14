export type ArticleStatus = "draft" | "scheduled" | "published" | "archived";
export type ServiceStatus = "draft" | "published" | "archived";

export function publicationState(publishedAt?: Date, now = new Date()) {
  if (!publishedAt || publishedAt <= now)
    return { status: "published" as const, publishedAt: publishedAt ?? now };
  return { status: "scheduled" as const, publishedAt };
}

export function canEditArticle(role: string | null | undefined, userId: string, authorId: string) {
  return role === "admin" || role === "editor" || (role === "author" && userId === authorId);
}
