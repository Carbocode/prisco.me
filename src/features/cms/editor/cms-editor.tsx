import { Node } from "@tiptap/core";
import { Link as LinkExtension } from "@tiptap/extension-link";
import { Placeholder as PlaceholderExtension } from "@tiptap/extension-placeholder";
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
  type ReactNodeViewProps,
} from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CmsDocument } from "../domain/cms-document";

export function CmsEditor({
  value,
  onChange,
  media = [],
}: {
  value: CmsDocument;
  onChange: (value: CmsDocument) => void;
  media?: Array<{ id: string; filename: string; url: string; altText: string | null }>;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      LinkExtension.configure({ openOnClick: false, protocols: ["http", "https", "mailto"] }),
      PlaceholderExtension.configure({ placeholder: "Scrivi il contenuto…" }),
      MediaImage.configure({ media }),
    ],
    content: value,
    onUpdate: ({ editor: updatedEditor }) => onChange(updatedEditor.getJSON() as CmsDocument),
  });
  useEffect(() => {
    if (editor && JSON.stringify(editor.getJSON()) !== JSON.stringify(value))
      editor.commands.setContent(value);
  }, [editor, value]);
  if (!editor) return null;
  const link = () => {
    const href = prompt("URL del link");
    if (href === null) return;
    if (!href) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Grassetto
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Corsivo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Barrato
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Elenco
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numerato
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Citazione
        </Button>
        <Button type="button" variant="outline" onClick={link}>
          Link
        </Button>
        <Select
          onValueChange={(mediaId) => {
            if (mediaId)
              editor
                .chain()
                .focus()
                .insertContent({ type: "mediaImage", attrs: { mediaId } })
                .run();
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Inserisci immagine" />
          </SelectTrigger>
          <SelectContent>
            {media.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.filename}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={() => editor.chain().focus().undo().run()}>
          Annulla
        </Button>
        <Button type="button" variant="outline" onClick={() => editor.chain().focus().redo().run()}>
          Ripeti
        </Button>
      </div>
      <EditorContent editor={editor} className="prose prose-invert min-h-80 max-w-none py-4" />
    </div>
  );
}

const MediaImage = Node.create({
  name: "mediaImage",
  group: "block",
  atom: true,
  addOptions() {
    return {
      media: [] as Array<{ id: string; filename: string; url: string; altText: string | null }>,
    };
  },
  addAttributes() {
    return { mediaId: { default: null }, alt: { default: null }, caption: { default: null } };
  },
  parseHTML() {
    return [{ tag: "figure[data-cms-media-id]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["figure", { "data-cms-media-id": HTMLAttributes.mediaId }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(MediaImageView);
  },
});

function MediaImageView({ editor, node, selected }: ReactNodeViewProps) {
  const extension = editor.extensionManager.extensions.find((item) => item.name === "mediaImage");
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const items = extension?.options.media as Array<{
    id: string;
    url: string;
    altText: string | null;
  }>;
  const item = items.find((media) => media.id === node.attrs.mediaId);
  return (
    <NodeViewWrapper>
      <figure data-selected={selected || undefined}>
        {item ? (
          <img src={item.url} alt={node.attrs.alt ?? item.altText ?? ""} />
        ) : (
          <p>Immagine non disponibile</p>
        )}
        {node.attrs.caption ? <figcaption>{node.attrs.caption}</figcaption> : null}
      </figure>
    </NodeViewWrapper>
  );
}
