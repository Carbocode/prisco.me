import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";

import { createAuth } from "@/lib/auth";
import { roleHasPermission, type CmsResource } from "@/lib/cms-permissions";

import { canEditArticle } from "../domain/workflow";
import { CmsError } from "./cms-errors";

export async function requireSession() {
  const session = await createAuth(env).api.getSession({ headers: getRequestHeaders() });
  if (!session) throw new CmsError(401, "UNAUTHENTICATED", "Authentication required");
  return session;
}
export async function requireCmsPermission(resource: CmsResource, action: string) {
  const session = await requireSession();
  if (!roleHasPermission(session.user.role, resource, action))
    throw new CmsError(403, "FORBIDDEN", "Permission denied");
  return session;
}
export function requireArticleAccess(
  user: { id: string; role?: string | null },
  article: { authorId: string; deletedAt?: Date | null },
  action: string,
) {
  if (
    !canEditArticle(user.role, user.id, article.authorId) ||
    (user.role === "author" && action === "publish")
  )
    throw new CmsError(403, "FORBIDDEN", "Permission denied");
  if (article.deletedAt && action !== "restore")
    throw new CmsError(403, "ARTICLE_DELETED", "Restore the article before editing it");
}
