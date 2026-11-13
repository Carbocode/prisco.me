import { useEffect, useEffectEvent } from "react";
import { flushSync } from "react-dom";
import { z } from "zod";

import type { useArticleForm } from "@/features/cms/components/article-form/use-article-form";
import { registerSiteTools, siteTool } from "@/lib/webmcp";

const fields = z.strictObject({
  title: z.string().min(3).max(160).optional(),
  excerpt: z.string().max(320).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(180).optional(),
  categoryId: z.string().uuid().optional(),
});

type ArticleState = ReturnType<typeof useArticleForm>;

export function useArticleSiteTools(state: ArticleState) {
  const context = useEffectEvent(() => ({
    title: state.title,
    excerpt: state.excerpt,
    seoTitle: state.seoTitle,
    seoDescription: state.seoDescription,
    categoryId: state.activeCategoryId,
    categories: state.categories.map(({ id, name }) => ({ id, name })),
    status: state.article?.status ?? "draft",
    readOnly: state.readOnly,
    pending: state.pending,
    dirty: state.dirty,
  }));
  const update = useEffectEvent((input: z.output<typeof fields>) => {
    if (state.readOnly || state.pending) throw new Error("Article is read-only or busy");
    if (input.categoryId && !state.categories.some(({ id }) => id === input.categoryId))
      throw new Error("Unknown category");
    if (input.categoryId && input.categoryId !== state.activeCategoryId && state.tagIds.length)
      throw new Error("Change category manually to review the existing tags");
    flushSync(() => {
      if (input.title !== undefined) state.setTitle(input.title);
      if (input.excerpt !== undefined) state.setExcerpt(input.excerpt);
      if (input.seoTitle !== undefined) state.setSeoTitle(input.seoTitle);
      if (input.seoDescription !== undefined) state.setSeoDescription(input.seoDescription);
      if (input.categoryId !== undefined) state.requestCategoryChange(input.categoryId);
      state.setDirty(true);
    });
    return { updated: true, saved: false };
  });
  const save = useEffectEvent(async () => {
    if (state.readOnly || state.pending || (state.article && state.article.status !== "draft"))
      throw new Error("Only an idle draft can be saved through this tool");
    return state.save();
  });
  const readOnly = state.readOnly;
  const draft = !state.article || state.article.status === "draft";
  useEffect(
    () =>
      registerSiteTools([
        siteTool(
          "article_read_fields",
          "Read the open article's title, summary, SEO fields, category choices and save state. Does not read the body; use editor_read_blocks for that.",
          z.strictObject({}),
          true,
          context,
        ),
        ...(!readOnly
          ? [
              siteTool(
                "article_update_fields",
                "Update title, summary, SEO fields or category in the open form. Changes remain unsaved. Category changes with existing tags require manual review.",
                fields,
                false,
                update,
              ),
            ]
          : []),
        ...(!readOnly && draft
          ? [
              siteTool(
                "article_save_draft",
                "Save the current draft, including body and fields, through normal CMS validation and revision checks. Requires a valid title and category. Never publishes. Returns saved:false on validation or server errors.",
                z.strictObject({}),
                false,
                save,
              ),
            ]
          : []),
      ]),
    [readOnly, draft],
  );
}
