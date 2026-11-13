import { useBlocker, useNavigate, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/features/auth/client/auth-client";
import { roleHasPermission } from "@/features/auth/domain/permissions";
import {
  localDateTime,
  validateArticleInput,
  articleSaveError,
  articleStatusLabels,
} from "@/features/cms/components/article-form/article-form-model";
import { type Revision } from "@/features/cms/components/article-form/article-form.types";
import { slugify } from "@/features/cms/domain/slug";
import {
  archiveArticleFn,
  createArticleFn,
  publishArticleFn,
  restoreArticleFn,
  restoreArticleRevisionFn,
  unpublishArticleFn,
  updateArticleFn,
} from "@/features/cms/server/article.functions";
import {
  EMPTY_CMS_DOCUMENT,
  parseCmsDocument,
  type CmsDocument,
} from "@/features/content/domain/document";
import { useMediaQuery } from "@/hooks/use-media-query";

import type { ArticleFormProps } from "./article-form.types";

export function useArticleForm({
  article,
  categories = [],
  tags = [],
  organizations = [],
  experiences = [],
  media = [],
  revisions = [],
}: ArticleFormProps) {
  const { data: session } = authClient.useSession();
  const canPublish = roleHasPermission(session?.user.role, "cmsArticle", "publish");
  const canRestore = roleHasPermission(session?.user.role, "cmsArticle", "restore");
  const canArchive = roleHasPermission(session?.user.role, "cmsArticle", "delete");
  const readOnly =
    session?.user.role === "author" && article !== undefined && article.status !== "draft";
  const navigate = useNavigate();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState<CmsDocument>(
    article ? parseCmsDocument(article.content) : EMPTY_CMS_DOCUMENT,
  );
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(article?.seoDescription ?? "");
  const [noIndex, setNoIndex] = useState(article?.noIndex ?? false);
  const [categoryIds, setCategoryIds] = useState(article?.categoryIds.slice(0, 1) ?? []);
  const [experienceIds, setExperienceIds] = useState(article?.experienceIds ?? []);
  const [tagIds, setTagIds] = useState(article?.tagIds ?? []);
  const [confirmAction, setConfirmAction] = useState<
    { kind: "archive" } | { kind: "revision"; id: string } | null
  >(null);
  const [previewRevision, setPreviewRevision] = useState<Revision | null>(null);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);
  const [coverMediaId, setCoverMediaId] = useState(article?.coverMediaId ?? "");
  const [organizationId, setOrganizationId] = useState(article?.organizationId ?? "");
  const [projectRole, setProjectRole] = useState(article?.projectRole ?? "");
  const [projectPeriod, setProjectPeriod] = useState(article?.projectPeriod ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(article?.canonicalUrl ?? "");
  const [projectFeatured, setProjectFeatured] = useState(article?.projectFeatured ?? false);
  const [projectSortOrder, setProjectSortOrder] = useState(article?.projectSortOrder ?? 0);
  const [publishedAt, setPublishedAt] = useState(
    article?.publishedAt ? localDateTime(article.publishedAt) : "",
  );
  const [renderTime, setRenderTime] = useState(() => Date.now());
  const [version, setVersion] = useState(article?.version ?? 0);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [pending, setPending] = useState(false);
  const [dirty, updateDirty] = useState(false);
  const edits = useRef(0);
  const dirtyRef = useRef(false);
  function setDirty(value: boolean) {
    if (value) edits.current += 1;
    dirtyRef.current = value;
    updateDirty(value);
  }
  const blocker = useBlocker({
    shouldBlockFn: () => dirtyRef.current,
    enableBeforeUnload: () => dirtyRef.current,
    withResolver: true,
  });
  const [conflict, setConflict] = useState(false);
  const effectiveSlug = slugTouched ? slug : slugify(title);
  const activeCategoryId = categoryIds[0] ?? "";
  const imageMedia = media.filter((item) => item.mimeType.startsWith("image/"));
  const activeCategorySlug = categories.find((item) => item.id === activeCategoryId)?.slug;
  const publicArchiveSlug = activeCategorySlug ?? "categoria";
  const selectedTags = tagIds.flatMap((id) => {
    const tag = tags.find((item) => item.id === id);
    return tag ? [tag] : [];
  });
  const availableTags = tags.filter(
    (tag) => tag.categoryId === activeCategoryId && !tagIds.includes(tag.id),
  );
  function applyCategory(categoryId: string) {
    setCategoryIds([categoryId]);
    setTagIds([]);
    setDirty(true);
    setPendingCategoryId(null);
  }
  function requestCategoryChange(categoryId: string) {
    if (categoryId === activeCategoryId) return;
    if (tagIds.length) {
      setPendingCategoryId(categoryId);
      return;
    }
    applyCategory(categoryId);
  }
  function moveTag(index: number, offset: -1 | 1) {
    const destination = index + offset;
    if (destination < 0 || destination >= tagIds.length) return;
    setTagIds((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
    setDirty(true);
  }
  async function save() {
    if (pending) return { saved: false, error: "Save already in progress" };
    const validationError = validateArticleInput({
      title,
      slug: effectiveSlug,
      categoryIds,
      projectSortOrder,
    });
    if (validationError) {
      toast.error(validationError, { id: "article-save" });
      return { saved: false, error: validationError };
    }
    const toastId = toast.loading(article ? "Salvataggio modifiche…" : "Creazione bozza…", {
      id: "article-save",
    });
    const savedEdits = edits.current;
    setPending(true);
    try {
      const base = {
        title,
        slug: effectiveSlug,
        excerpt: excerpt || null,
        content,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        noIndex,
        categoryIds,
        tagIds,
        experienceIds,
        coverMediaId: coverMediaId || null,
        organizationId: organizationId || null,
        projectRole: projectRole || null,
        projectPeriod: projectPeriod || null,
        canonicalUrl: canonicalUrl || null,
        projectFeatured,
        projectSortOrder,
        ...(canPublish ? { publishedAt: publishedAt ? new Date(publishedAt) : null } : {}),
      };
      const saved = article
        ? await updateArticleFn({
            data: {
              id: article.id,
              version,
              ...base,
            },
          })
        : await createArticleFn({ data: base });
      setVersion(saved.version);
      setDirty(edits.current !== savedEdits);
      const savedAt = new Date();
      setLastSavedAt(savedAt);
      toast.success("Articolo salvato correttamente", { id: toastId });
      if (article) void router.invalidate();
      else
        void navigate({
          to: "/dashboard/cms/articles/$articleId",
          params: { articleId: saved.id },
        });
      return { saved: true, id: saved.id, version: saved.version };
    } catch (error) {
      const message = articleSaveError(error);
      if (message.type === "conflict") setConflict(true);
      toast.error(message.text, { id: toastId });
      return { saved: false, error: message.text };
    } finally {
      setPending(false);
    }
  }
  async function publish() {
    if (!article) return;
    setPending(true);
    try {
      await publishArticleFn({
        data: {
          id: article.id,
          version,
          publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        },
      });
      setDirty(false);
      toast.success("Pubblicazione aggiornata");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pubblicazione non riuscita");
    } finally {
      setPending(false);
    }
  }
  async function changeStatus(action: "unpublish" | "archive" | "restore") {
    if (!article) return;
    setPending(true);
    try {
      const data = { id: article.id, version };
      if (action === "archive") await archiveArticleFn({ data });
      else if (action === "restore") await restoreArticleFn({ data });
      else await unpublishArticleFn({ data });
      setDirty(false);
      toast.success("Stato aggiornato");
      void navigate({ to: "/dashboard/cms/articles", search: { page: 1 } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operazione non riuscita");
    } finally {
      setPending(false);
    }
  }
  async function restoreRevision(revisionId: string) {
    if (!article) return;
    setPending(true);
    try {
      await restoreArticleRevisionFn({
        data: { articleId: article.id, revisionId, version },
      });
      setDirty(false);
      toast.success("Revisione ripristinata");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ripristino non riuscito");
    } finally {
      setPending(false);
    }
  }
  const statusLabel = article
    ? (articleStatusLabels[article.status] ?? article.status)
    : "Nuova bozza";

  return {
    article,
    categories,
    tags,
    organizations,
    experiences,
    media,
    revisions,
    canPublish,
    canRestore,
    canArchive,
    readOnly,
    isDesktop,
    title,
    setTitle,
    slug,
    setSlug,
    setSlugTouched,
    excerpt,
    setExcerpt,
    content,
    setContent,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    noIndex,
    setNoIndex,
    categoryIds,
    experienceIds,
    setExperienceIds,
    tagIds,
    setTagIds,
    confirmAction,
    setConfirmAction,
    previewRevision,
    setPreviewRevision,
    pendingCategoryId,
    setPendingCategoryId,
    coverMediaId,
    setCoverMediaId,
    organizationId,
    setOrganizationId,
    projectRole,
    setProjectRole,
    projectPeriod,
    setProjectPeriod,
    canonicalUrl,
    setCanonicalUrl,
    projectFeatured,
    setProjectFeatured,
    projectSortOrder,
    setProjectSortOrder,
    publishedAt,
    setPublishedAt,
    renderTime,
    setRenderTime,
    lastSavedAt,
    pending,
    dirty,
    setDirty,
    blocker,
    conflict,
    effectiveSlug,
    activeCategoryId,
    imageMedia,
    publicArchiveSlug,
    selectedTags,
    availableTags,
    applyCategory,
    requestCategoryChange,
    moveTag,
    save,
    publish,
    changeStatus,
    restoreRevision,
    statusLabel,
  };
}
