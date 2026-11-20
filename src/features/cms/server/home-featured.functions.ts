import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { roleHasPermission } from "@/features/auth/domain/permissions";

import { HOME_FEATURED_CATEGORIES } from "../domain/home-featured";
import { db } from "./articles/connection";
import { requireCmsPermission } from "./cms-auth";
import { addHomeFeatured, listHomeFeatured, removeHomeFeatured } from "./home-featured.repository";

export const listHomeFeaturedFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireCmsPermission("cmsArticle", "list");
  return roleHasPermission(session.user.role, "cmsArticle", "publish")
    ? listHomeFeatured(db())
    : null;
});

export const setHomeFeaturedFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      category: z.enum(HOME_FEATURED_CATEGORIES),
      articleId: z.string().min(1).max(180),
      featured: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsArticle", "publish");
    if (data.featured) return addHomeFeatured(db(), data.category, data.articleId);
    await removeHomeFeatured(db(), data.category, data.articleId);
    return true;
  });
