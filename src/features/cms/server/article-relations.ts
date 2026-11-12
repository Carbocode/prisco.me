import { and, eq, inArray, isNull } from "drizzle-orm";

import { cmsCategories, cmsTags, cmsOrganizations, cmsMedia } from "@/db/schema";

import { parseCmsDocument } from "../domain/cms-document";
import { mediaIdsInDocument } from "../domain/media-associations";
import { CmsError } from "./cms-errors";
import type { CmsDb } from "./cms.repository";

export async function assertArticleRelations(
  database: CmsDb,
  input: {
    categoryIds: string[];
    tagIds: string[];
    organizationId?: string | null;
    coverMediaId?: string | null;
    content: string;
  },
) {
  const category = await database.query.cmsCategories.findFirst({
    where: and(eq(cmsCategories.id, input.categoryIds[0] ?? ""), isNull(cmsCategories.deletedAt)),
  });
  if (!category || input.categoryIds.length !== 1)
    throw new CmsError(422, "INVALID_CATEGORY", "Seleziona una categoria attiva");
  if (new Set(input.tagIds).size !== input.tagIds.length)
    throw new CmsError(422, "INVALID_TAGS", "Tag duplicati");
  if (input.tagIds.length) {
    const tags = await database
      .select()
      .from(cmsTags)
      .where(
        and(
          inArray(cmsTags.id, input.tagIds),
          eq(cmsTags.categoryId, category.id),
          isNull(cmsTags.deletedAt),
        ),
      );
    if (tags.length !== input.tagIds.length)
      throw new CmsError(
        422,
        "INVALID_TAGS",
        "I tag devono essere attivi e appartenere alla categoria scelta",
      );
  }
  if (
    input.organizationId &&
    !(await database.query.cmsOrganizations.findFirst({
      where: and(eq(cmsOrganizations.id, input.organizationId), isNull(cmsOrganizations.deletedAt)),
    }))
  )
    throw new CmsError(422, "INVALID_ORGANIZATION", "Organizzazione non disponibile");
  const mediaIds = mediaIdsInDocument(parseCmsDocument(input.content));
  if (input.coverMediaId) mediaIds.add(input.coverMediaId);
  if (mediaIds.size) {
    const media = await database
      .select()
      .from(cmsMedia)
      .where(and(inArray(cmsMedia.id, [...mediaIds]), isNull(cmsMedia.deletedAt)));
    if (
      media.length !== mediaIds.size ||
      (input.coverMediaId &&
        !media.find((item) => item.id === input.coverMediaId)?.mimeType.startsWith("image/"))
    )
      throw new CmsError(422, "INVALID_MEDIA", "Media non disponibile o cover non valida");
  }
}
