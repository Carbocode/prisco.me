import { db } from "@/features/cms/server/articles/connection";
import { getAdminArticle } from "@/features/cms/server/articles/queries";
import { articleRepository, cmsArticleRevisions } from "@/features/cms/server/cms.repository";

export async function transitionSnapshot(
  database: ReturnType<typeof db>,
  current: NonNullable<Awaited<ReturnType<ReturnType<typeof articleRepository>["byId"]>>>,
  actorId: string,
) {
  const revision = (await articleRepository(database).nextRevision(current.id))[0]?.value ?? 1;
  return {
    statement: database.insert(cmsArticleRevisions).values({
      articleId: current.id,
      revision,
      snapshot: JSON.stringify({ ...(await getAdminArticle(current.id)), ...current }),
      createdById: actorId,
    }),
  };
}
