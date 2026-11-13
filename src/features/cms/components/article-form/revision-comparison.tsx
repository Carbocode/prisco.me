import {
  type Revision,
  type Category,
  type Tag,
  type Media,
} from "@/features/cms/components/article-form/article-form.types";
import { parseCmsDocument, type CmsDocument } from "@/features/content/domain/document";
import { renderCmsDocument } from "@/features/content/rendering/render-document";

export function RevisionComparison({
  revision,
  current,
  categories,
  tags,
  media,
}: {
  revision: Revision;
  current: {
    title: string;
    slug: string;
    content: CmsDocument;
    categoryIds: string[];
    tagIds: string[];
  };
  categories: Category[];
  tags: Tag[];
  media: Media[];
}) {
  const snapshot: unknown = JSON.parse(revision.snapshot);
  if (
    !snapshot ||
    typeof snapshot !== "object" ||
    !("content" in snapshot) ||
    typeof snapshot.content !== "string"
  )
    return <p>Revisione non valida</p>;
  const value = snapshot as Record<string, unknown>; // oxlint-disable-line typescript/no-unsafe-type-assertion
  const mediaMap = new Map(media.map((item) => [item.id, item]));
  const labels = (ids: unknown, options: { id: string; name: string }[]) =>
    Array.isArray(ids)
      ? ids.map((id) => options.find((item) => item.id === id)?.name ?? String(id)).join(", ")
      : "Non presente nella revisione";
  return (
    <div className="grid max-h-96 gap-4 overflow-y-auto">
      <section>
        <h3>Revisione salvata</h3>
        <p>
          {String(value.title)} · /{String(value.slug)}
        </p>
        <p>Categoria: {labels(value.categoryIds, categories)}</p>
        <p>Tag: {labels(value.tagIds, tags)}</p>
        {renderCmsDocument(parseCmsDocument(snapshot.content), mediaMap)}
      </section>
      <section>
        <h3>Contenuto attuale</h3>
        <p>
          {current.title} · /{current.slug}
        </p>
        <p>Categoria: {labels(current.categoryIds, categories)}</p>
        <p>Tag: {labels(current.tagIds, tags)}</p>
        {renderCmsDocument(current.content, mediaMap)}
      </section>
    </div>
  );
}
