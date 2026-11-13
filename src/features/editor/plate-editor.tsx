import { insertLink, upsertLink } from "@platejs/link";
import { KEYS, type Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Field } from "@/components/ui/field";
import { getEmbedPreviewFn } from "@/features/cms/server/embed.functions";
import { fromPlateValue, toPlateValue, type CmsDocument } from "@/features/content/domain/document";
import { toPublicHttpUrl } from "@/features/content/embeds/embed-url";
import { useEditorSiteTools } from "@/features/editor/client/use-editor-site-tools";
import { EmbedDialog } from "@/features/editor/components/dialogs/embed-dialog";
import { ImageDialog } from "@/features/editor/components/dialogs/image-dialog";
import { LinkDialog } from "@/features/editor/components/dialogs/link-dialog";
import { Editor, EditorContainer } from "@/features/editor/components/editor";
import { EditorStatus } from "@/features/editor/components/editor-status";
import { EditorToolbar } from "@/features/editor/components/toolbar/editor-toolbar";
import { FixedToolbar } from "@/features/editor/components/toolbar/fixed-toolbar";
import { EditorActionsProvider, type MediaKind } from "@/features/editor/editor-actions-context";
import { safeHref } from "@/features/editor/editor-model";
import { type MediaItem, MediaContext } from "@/features/editor/media-context";
import { editorPlugins } from "@/features/editor/plugins/editor-plugins";

export function CmsEditor({
  readOnly = false,
  value,
  onChange,
  media = [],
}: {
  value: CmsDocument;
  onChange: (value: CmsDocument) => void;
  media?: MediaItem[];
  readOnly?: boolean;
}) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"audio" | "file" | "image" | "video">("image");
  const [selectedMediaId, setSelectedMediaId] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");
  const [embedLoading, setEmbedLoading] = useState(false);
  const mediaMap = useMemo(() => new Map(media.map((item) => [item.id, item])), [media]);
  const editor = usePlateEditor({
    plugins: editorPlugins,
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- CMS nodes are validated before reaching Plate.
    value: toPlateValue(value) as Value,
  });

  useEditorSiteTools(editor, readOnly, media, onChange);

  useEffect(() => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- CMS nodes are validated before reaching Plate.
    const next = toPlateValue(value) as Value;
    if (JSON.stringify(editor.children) !== JSON.stringify(next)) editor.tf.setValue(next);
  }, [editor, value]);

  function openLinkDialog() {
    const entry = editor.api.above({ match: (node) => "type" in node && node.type === KEYS.link });
    const selected = editor.selection ? editor.api.string(editor.selection) : "";
    setLinkText(selected || (entry ? editor.api.string(entry[1]) : ""));
    setLinkHref(entry && typeof entry[0].url === "string" ? entry[0].url : "");
    setLinkDialogOpen(true);
  }

  function saveLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = linkText.trim();
    const url = linkHref.trim();
    if (!text || !safeHref(url)) return;
    if (editor.selection) upsertLink(editor, { url, text, skipValidation: true });
    else insertLink(editor, { url, text });
    editor.tf.focus();
    setLinkDialogOpen(false);
  }

  function insertImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMediaId) return;
    editor.tf.insertNodes({
      type: "mediaImage",
      mediaType,
      mediaId: selectedMediaId,
      alt: imageAlt.trim() || undefined,
      caption: imageCaption.trim() || undefined,
      children: [{ text: "" }],
    });
    editor.tf.focus();
    setImageDialogOpen(false);
    setSelectedMediaId("");
    setImageAlt("");
    setImageCaption("");
  }

  async function insertEmbed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = embedUrl.trim();
    if (!toPublicHttpUrl(url)) return;
    setEmbedLoading(true);
    try {
      const preview = await getEmbedPreviewFn({ data: { url } });
      editor.tf.insertNodes({
        type: "mediaEmbed",
        url: preview.url,
        metadata: preview.metadata,
        children: [{ text: "" }],
      });
      editor.tf.focus();
      setEmbedDialogOpen(false);
      setEmbedUrl("");
    } catch {
      toast.error("Non è stato possibile leggere i metadati del link");
    } finally {
      setEmbedLoading(false);
    }
  }

  const actions = useMemo(
    () => ({
      onMedia: (type: MediaKind) => {
        setMediaType(type);
        setImageDialogOpen(true);
      },
      onEmbed: () => setEmbedDialogOpen(true),
    }),
    [],
  );

  return (
    <Field className="xl:min-h-0 xl:flex-1">
      <MediaContext.Provider value={mediaMap}>
        <EditorActionsProvider value={actions}>
          <Plate
            readOnly={readOnly}
            editor={editor}
            onValueChange={({ value: next }) => onChange(fromPlateValue(next))}
          >
            <div className="cms-editor">
              {!readOnly ? (
                <FixedToolbar className="cms-editor__toolbar rounded-none">
                  <EditorToolbar onLink={openLinkDialog} />
                </FixedToolbar>
              ) : null}
              <EditorContainer className="cms-editor__canvas">
                <Editor
                  id="cms-content-editor"
                  variant="none"
                  className="cms-editor__content rounded-none"
                  aria-label="Corpo del contenuto"
                  placeholder="Inizia a scrivere il contenuto…"
                  spellCheck
                />
              </EditorContainer>
              <EditorStatus />
            </div>
            <LinkDialog
              open={linkDialogOpen}
              onOpenChange={setLinkDialogOpen}
              text={linkText}
              href={linkHref}
              onTextChange={setLinkText}
              onHrefChange={setLinkHref}
              onSubmit={saveLink}
            />
            <ImageDialog
              open={imageDialogOpen}
              onOpenChange={setImageDialogOpen}
              media={media}
              selectedMediaId={selectedMediaId}
              alt={imageAlt}
              caption={imageCaption}
              mediaType={mediaType}
              onMediaChange={setSelectedMediaId}
              onAltChange={setImageAlt}
              onCaptionChange={setImageCaption}
              onSubmit={insertImage}
            />
            <EmbedDialog
              open={embedDialogOpen}
              onOpenChange={setEmbedDialogOpen}
              url={embedUrl}
              onUrlChange={setEmbedUrl}
              onSubmit={insertEmbed}
              loading={embedLoading}
            />
          </Plate>
        </EditorActionsProvider>
      </MediaContext.Provider>
    </Field>
  );
}
