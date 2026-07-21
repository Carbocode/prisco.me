import emojiMartData from "@emoji-mart/data";
import {
  BlockquotePlugin,
  BoldPlugin,
  CodePlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  HighlightPlugin,
  HorizontalRulePlugin,
  ItalicPlugin,
  KbdPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  LineHeightPlugin,
  TextAlignPlugin,
} from "@platejs/basic-styles/react";
import { CalloutPlugin } from "@platejs/callout/react";
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from "@platejs/code-block/react";
import { CodeDrawingPlugin } from "@platejs/code-drawing/react";
import { DatePlugin } from "@platejs/date/react";
import { DndPlugin } from "@platejs/dnd";
import { EmojiInputPlugin, EmojiPlugin } from "@platejs/emoji/react";
import { IndentPlugin } from "@platejs/indent/react";
import { ColumnItemPlugin, ColumnPlugin } from "@platejs/layout/react";
import { insertLink, LinkRules, unwrapLink, upsertLink } from "@platejs/link";
import { LinkPlugin } from "@platejs/link/react";
import { someList, toggleList } from "@platejs/list";
import { ListPlugin } from "@platejs/list/react";
import { EquationPlugin, InlineEquationPlugin } from "@platejs/math/react";
import { MentionInputPlugin, MentionPlugin } from "@platejs/mention/react";
import { ResizableProvider, useResizableValue } from "@platejs/resizable";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { SlashInputPlugin, SlashPlugin } from "@platejs/slash-command/react";
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@platejs/table/react";
import { TocPlugin, useTocElement, useTocElementState } from "@platejs/toc/react";
import { TogglePlugin } from "@platejs/toggle/react";
import { all, createLowlight } from "lowlight";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Code2,
  Highlighter,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  PaintBucket,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
import { ExitBreakPlugin, KEYS, type TElement, TrailingBlockPlugin, type Value } from "platejs";
import {
  BlockPlaceholderPlugin,
  ParagraphPlugin,
  Plate,
  PlateElement,
  createPlatePlugin,
  useEditorRef,
  useEditorSelector,
  useNodePath,
  usePlateEditor,
  withHOC,
  type PlateElementProps,
} from "platejs/react";
import { createContext, useContext, useEffect, useMemo, useState, type FormEvent } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";

import { HoverAnimatedImage } from "@/components/hover-animated-image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { mediaResizeHandleVariants, Resizable, ResizeHandle } from "@/components/ui/resize-handle";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { MediaBrowser } from "@/features/cms/components/media-picker";
import { fromPlateValue, toPlateValue, type CmsDocument } from "@/features/cms/domain/cms-document";
import { getEmbedPreviewFn } from "@/features/cms/server/embed.functions";
import { autoformatPlugin } from "@/features/editor/autoformat-plugin";
import { BlockDraggable } from "@/features/editor/components/block-draggable";
import { CalloutElement } from "@/features/editor/components/callout-node";
import {
  CodeBlockElement,
  CodeLineElement,
  CodeSyntaxLeaf,
} from "@/features/editor/components/code-block-node";
import { CodeDrawingElement } from "@/features/editor/components/code-drawing-node";
import { ColumnElement, ColumnGroupElement } from "@/features/editor/components/column-node";
import { DateElement } from "@/features/editor/components/date-node";
import { Editor, EditorContainer } from "@/features/editor/components/editor";
import { EmojiInputElement } from "@/features/editor/components/emoji-node";
import { EmojiToolbarButton } from "@/features/editor/components/emoji-toolbar-button";
import { EquationElement, InlineEquationElement } from "@/features/editor/components/equation-node";
import { FixedToolbar } from "@/features/editor/components/fixed-toolbar";
import { FloatingToolbar } from "@/features/editor/components/floating-toolbar";
import { FloatingToolbarButtons } from "@/features/editor/components/floating-toolbar-buttons";
import { FontColorToolbarButton } from "@/features/editor/components/font-color-toolbar-button";
import {
  RedoToolbarButton,
  UndoToolbarButton,
} from "@/features/editor/components/history-toolbar-button";
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from "@/features/editor/components/indent-toolbar-button";
import { LineHeightToolbarButton } from "@/features/editor/components/line-height-toolbar-button";
import { LinkElement } from "@/features/editor/components/link-node";
import { LinkFloatingToolbar } from "@/features/editor/components/link-toolbar";
import { MarkToolbarButton } from "@/features/editor/components/mark-toolbar-button";
import { MediaEmbedElement } from "@/features/editor/components/media-embed-node";
import { MentionElement, MentionInputElement } from "@/features/editor/components/mention-node";
import { SlashInputElement } from "@/features/editor/components/slash-node";
import { TableToolbarButton } from "@/features/editor/components/table-toolbar-button";
import { ToggleElement } from "@/features/editor/components/toggle-node";
import {
  ToolbarButton as PlateToolbarButton,
  ToolbarGroup,
} from "@/features/editor/components/toolbar";
import { EditorActionsProvider, type MediaKind } from "@/features/editor/editor-actions-context";
import { toPublicHttpUrl } from "@/features/editor/embed-url";

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  altText: string | null;
  mimeType: string;
};
const MediaContext = createContext<Map<string, MediaItem>>(new Map());

function ParagraphElement(props: PlateElementProps) {
  const element = props.element as TElement & {
    checked?: boolean;
    indent?: number;
    listStyleType?: string;
    textAlign?: string;
  };
  const editor = useEditorRef();
  const path = useNodePath(element);
  if (element.listStyleType === "todo") {
    return (
      <PlateElement
        {...props}
        as="div"
        className="cms-plate-list-item"
        style={{ marginLeft: `${Math.max(0, (element.indent ?? 1) - 1) * 1.5}rem` }}
      >
        <span contentEditable={false}>
          <Checkbox
            checked={element.checked === true}
            aria-label="Completa attività"
            onCheckedChange={(checked) => {
              if (path) editor.tf.setNodes({ checked }, { at: path });
            }}
          />
        </span>
        <span>{props.children}</span>
      </PlateElement>
    );
  }
  if (element.listStyleType) {
    return (
      <PlateElement
        {...props}
        as="div"
        className="cms-plate-list-item"
        data-list-type={element.listStyleType}
        style={{
          marginLeft: `${Math.max(0, (element.indent ?? 1) - 1) * 1.5}rem`,
          textAlign: textAlignment(element.textAlign),
        }}
      >
        <span contentEditable={false} className="cms-plate-list-marker" />
        <span>{props.children}</span>
      </PlateElement>
    );
  }
  return <PlateElement {...props} as="p" style={{ textAlign: textAlignment(element.textAlign) }} />;
}

function HeadingElement({ as, ...props }: PlateElementProps & { as: "h1" | "h2" | "h3" | "h4" }) {
  const element = props.element as TElement & { textAlign?: string };
  return (
    <PlateElement {...props} as={as} style={{ textAlign: textAlignment(element.textAlign) }} />
  );
}

function BlockquoteElement(props: PlateElementProps) {
  return <PlateElement {...props} as="blockquote" />;
}

function HorizontalRuleElement(props: PlateElementProps) {
  return (
    <PlateElement {...props} as="div">
      <span contentEditable={false}>
        <Separator />
      </span>
      {props.children}
    </PlateElement>
  );
}

function TableElement(props: PlateElementProps) {
  return (
    <div className="cms-content-table">
      <PlateElement {...props} as="table">
        <tbody>{props.children}</tbody>
      </PlateElement>
    </div>
  );
}

function TableRowElement(props: PlateElementProps) {
  return <PlateElement {...props} as="tr" />;
}

function TableHeaderElement(props: PlateElementProps) {
  return <PlateElement {...props} as="th" />;
}

function TableCellElement(props: PlateElementProps) {
  return <PlateElement {...props} as="td" />;
}

const MediaImageElement = withHOC(
  ResizableProvider,
  function MediaImageElement(props: PlateElementProps) {
    const media = useContext(MediaContext);
    const width = useResizableValue("width");
    const element = props.element as TElement & {
      alt?: string;
      caption?: string;
      mediaId?: string;
      mediaType?: "audio" | "file" | "image" | "video";
    };
    const item = media.get(element.mediaId ?? "");
    const mediaType = element.mediaType ?? "image";

    return (
      <PlateElement {...props} as="figure">
        <div contentEditable={false}>
          {item && mediaType === "image" ? (
            <Resizable
              align="center"
              className="group"
              options={{ align: "left", maxWidth: "100%", minWidth: 120 }}
            >
              <HoverAnimatedImage
                src={item.url}
                alt={element.alt || item.altText || ""}
                containerClassName="w-full"
                className="h-auto w-full"
              />
              <ResizeHandle
                className={mediaResizeHandleVariants({ direction: "bottom" })}
                options={{ direction: "bottom" }}
              />
            </Resizable>
          ) : null}
          {item && mediaType === "video" ? (
            <video src={item.url} controls>
              <track kind="captions" />
            </video>
          ) : null}
          {item && mediaType === "audio" ? (
            <audio src={item.url} controls>
              <track kind="captions" />
            </audio>
          ) : null}
          {item && mediaType === "file" ? (
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.filename}
            </a>
          ) : null}
          {element.caption ? <figcaption style={{ width }}>{element.caption}</figcaption> : null}
        </div>
        {props.children}
      </PlateElement>
    );
  },
);

function TocElement(props: PlateElementProps) {
  const state = useTocElementState();
  const { props: tocProps } = useTocElement(state);
  return (
    <PlateElement {...props} as="nav" className="cms-content-toc">
      <div contentEditable={false}>
        <strong>In questa pagina</strong>
        {state.headingList.length ? (
          <ul>
            {state.headingList.map((heading) => (
              <li key={heading.id} data-depth={heading.depth}>
                <Button
                  type="button"
                  variant="link"
                  onClick={(event) => tocProps.onClick(event, heading, "smooth")}
                >
                  {heading.title}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aggiungi dei titoli per costruire l’indice.</p>
        )}
      </div>
      {props.children}
    </PlateElement>
  );
}

function safeHref(value: string | undefined) {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    return ["http:", "https:", "mailto:"].includes(new URL(value).protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

function textAlignment(value: unknown): "left" | "center" | "right" | "justify" | undefined {
  if (value === "left") return "left";
  if (value === "center") return "center";
  if (value === "right") return "right";
  if (value === "justify") return "justify";
  return undefined;
}

const MediaImagePlugin = createPlatePlugin({
  key: "mediaImage",
  node: { isElement: true, isVoid: true },
}).withComponent(MediaImageElement);

const MediaEmbedPlugin = createPlatePlugin({
  key: "mediaEmbed",
  node: { isElement: true, isVoid: true },
}).withComponent(MediaEmbedElement);

const lowlight = createLowlight(all);

const editorPlugins = [
  ParagraphPlugin.withComponent(ParagraphElement),
  H1Plugin.withComponent((props) => <HeadingElement {...props} as="h1" />),
  H2Plugin.withComponent((props) => <HeadingElement {...props} as="h2" />),
  H3Plugin.withComponent((props) => <HeadingElement {...props} as="h3" />),
  H4Plugin.withComponent((props) => <HeadingElement {...props} as="h4" />),
  BlockquotePlugin.withComponent(BlockquoteElement),
  HorizontalRulePlugin.withComponent(HorizontalRuleElement),
  BoldPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
  CodePlugin,
  HighlightPlugin,
  SuperscriptPlugin,
  SubscriptPlugin,
  KbdPlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
  LineHeightPlugin.configure({
    inject: {
      nodeProps: {
        defaultNodeValue: 1.5,
        validNodeValues: [1, 1.2, 1.5, 2, 3],
      },
      targetPlugins: [KEYS.p, KEYS.h1, KEYS.h2, KEYS.h3, KEYS.h4],
    },
  }),
  TextAlignPlugin,
  IndentPlugin,
  // Disable the plugin's built-in marker rendering — ParagraphElement draws the
  // markers/checkbox itself (kept in sync with the public renderer).
  ListPlugin.configure({ render: { belowNodes: () => undefined } }),
  CodeBlockPlugin.configure({
    node: { component: CodeBlockElement },
    options: { lowlight },
  }),
  CodeLinePlugin.withComponent(CodeLineElement),
  CodeSyntaxPlugin.withComponent(CodeSyntaxLeaf),
  CalloutPlugin.withComponent(CalloutElement),
  CodeDrawingPlugin.withComponent(CodeDrawingElement),
  DatePlugin.withComponent(DateElement),
  EquationPlugin.withComponent(EquationElement),
  InlineEquationPlugin.withComponent(InlineEquationElement),
  ColumnPlugin.withComponent(ColumnGroupElement),
  ColumnItemPlugin.withComponent(ColumnElement),
  MentionPlugin.configure({ options: { triggerPreviousCharPattern: /^$|^[\s"']$/ } }).withComponent(
    MentionElement,
  ),
  MentionInputPlugin.withComponent(MentionInputElement),
  BlockSelectionPlugin,
  LinkPlugin.configure({
    inputRules: [LinkRules.markdown(), LinkRules.autolink({ variant: "paste" })],
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
  TablePlugin.withComponent(TableElement),
  TableRowPlugin.withComponent(TableRowElement),
  TableCellPlugin.withComponent(TableCellElement),
  TableCellHeaderPlugin.withComponent(TableHeaderElement),
  TocPlugin.configure({ options: { topOffset: 96 } }).withComponent(TocElement),
  MediaImagePlugin,
  MediaEmbedPlugin,
  TogglePlugin.withComponent(ToggleElement),
  DndPlugin.configure({
    options: { enableScroller: true },
    render: {
      aboveNodes: BlockDraggable,
      aboveSlate: ({ children }) => <DndProvider backend={HTML5Backend}>{children}</DndProvider>,
    },
  }),
  // Slash command "/"
  SlashPlugin,
  SlashInputPlugin.withComponent(SlashInputElement),
  // Emoji combobox ":"
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- emoji-mart data shape.
  EmojiPlugin.configure({ options: { data: emojiMartData as never } }),
  EmojiInputPlugin.withComponent(EmojiInputElement),
  // Editing niceties
  autoformatPlugin,
  ExitBreakPlugin,
  TrailingBlockPlugin.configure({ options: { type: KEYS.p } }),
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        "before:absolute before:cursor-text before:text-muted-foreground/60 before:content-[attr(placeholder)]",
      placeholders: {
        [KEYS.p]: 'Scrivi qualcosa, oppure premi "/" per i comandi…',
      },
      query: ({ path }) => path.length === 1,
    },
  }),
  // Floating selection toolbar
  createPlatePlugin({
    key: "floating-toolbar",
    render: {
      afterEditable: () => (
        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
      ),
    },
  }),
];

export function CmsEditor({
  value,
  onChange,
  media = [],
}: {
  value: CmsDocument;
  onChange: (value: CmsDocument) => void;
  media?: MediaItem[];
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
        url,
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
            editor={editor}
            onValueChange={({ value: next }) => onChange(fromPlateValue(next))}
          >
            <div className="cms-editor">
              <FixedToolbar className="cms-editor__toolbar rounded-none">
                <EditorToolbar onLink={openLinkDialog} />
              </FixedToolbar>
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

function EmbedDialog({
  open,
  onOpenChange,
  url,
  onUrlChange,
  onSubmit,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Inserisci un embed</DialogTitle>
            <DialogDescription>
              YouTube e Vimeo saranno mostrati come video; gli altri link useranno titolo,
              descrizione e immagine Open Graph.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="plate-embed-url">Indirizzo</FieldLabel>
              <Input
                id="plate-embed-url"
                value={url}
                placeholder="https://esempio.it/pagina"
                onChange={(event) => onUrlChange(event.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Annulla</DialogClose>
            <Button type="submit" disabled={!toPublicHttpUrl(url) || loading}>
              {loading ? <Spinner data-icon="inline-start" /> : null}
              Inserisci
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditorStatus() {
  const words = useEditorSelector((editor) => countWords(editor.api.string([])), []);
  return (
    <div className="cms-editor__status">
      {words} {words === 1 ? "parola" : "parole"}
    </div>
  );
}

function EditorToolbar({ onLink }: { onLink: () => void }) {
  const state = useEditorSelector((current) => {
    const marks = (current.api.marks() ?? {}) as Record<string, unknown>;
    const block = current.api.block()?.[0];
    return {
      block: block?.type ?? KEYS.p,
      alignment: typeof block?.textAlign === "string" ? block.textAlign : "left",
      bold: marks.bold === true,
      italic: marks.italic === true,
      strike: marks.strikethrough === true,
      underline: marks.underline === true,
      code: marks.code === true,
      highlight: marks.highlight === true,
      superscript: marks.superscript === true,
      subscript: marks.subscript === true,
      bulletList: someList(current, KEYS.ul),
      orderedList: someList(current, KEYS.ol),
      taskList: someList(current, KEYS.listTodo),
      link: current.api.some({ match: (node) => "type" in node && node.type === KEYS.link }),
      table: current.api.some({ match: (node) => "type" in node && node.type === KEYS.table }),
    };
  }, []);

  return (
    <div className="flex w-full flex-wrap" aria-label="Formattazione testo">
      <ToolbarGroup>
        <UndoToolbarButton tooltip="Annulla" />
        <RedoToolbarButton tooltip="Ripristina" />
      </ToolbarGroup>

      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.bold} tooltip="Grassetto">
          <Bold />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.italic} tooltip="Corsivo">
          <Italic />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.underline} tooltip="Sottolineato">
          <Underline />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.strikethrough} tooltip="Barrato">
          <Strikethrough />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.code} tooltip="Codice inline">
          <Code2 />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.sup} clear={KEYS.sub} tooltip="Apice">
          <Superscript />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.sub} clear={KEYS.sup} tooltip="Pedice">
          <Subscript />
        </MarkToolbarButton>
        <FontColorToolbarButton nodeType={KEYS.color} tooltip="Colore testo">
          <Baseline />
        </FontColorToolbarButton>
        <FontColorToolbarButton nodeType={KEYS.backgroundColor} tooltip="Colore sfondo">
          <PaintBucket />
        </FontColorToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <AlignmentButtons alignment={state.alignment} />
        <ListMenu state={state} />
      </ToolbarGroup>

      <ToolbarGroup>
        <LinkButtons activeLink={state.link} onLink={onLink} />
        <TableToolbarButton />
        <EmojiToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <LineHeightToolbarButton />
        <OutdentToolbarButton />
        <IndentToolbarButton />
      </ToolbarGroup>

      <div className="grow" />

      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Evidenzia">
          <Highlighter />
        </MarkToolbarButton>
      </ToolbarGroup>
    </div>
  );
}

function ToolbarButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <PlateToolbarButton
      type="button"
      aria-label={label}
      pressed={active}
      tooltip={label}
      onClick={onClick}
    >
      {children}
    </PlateToolbarButton>
  );
}

function ListMenu({
  state,
}: {
  state: { bulletList: boolean; orderedList: boolean; taskList: boolean };
}) {
  const editor = useEditorRef();
  const apply = (listStyleType: string) => {
    toggleList(editor, { listStyleType });
    editor.tf.focus();
  };
  const active = state.bulletList || state.orderedList || state.taskList;
  const icon = state.orderedList ? <ListOrdered /> : state.taskList ? <ListChecks /> : <List />;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <PlateToolbarButton type="button" pressed={active} tooltip="Tipo di elenco" isDropdown>
            {icon}
          </PlateToolbarButton>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Tipo di elenco</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => apply(KEYS.ul)}>
            <List /> Elenco puntato
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => apply(KEYS.ol)}>
            <ListOrdered /> Elenco numerato
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => apply(KEYS.listTodo)}>
            <ListChecks /> Elenco attività
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AlignmentButtons({ alignment }: { alignment: string }) {
  const editor = useEditorRef();
  const align = (value: "left" | "center" | "right" | "justify") => {
    editor.tf.setNodes({ textAlign: value });
    editor.tf.focus();
  };
  const icon =
    alignment === "center" ? (
      <AlignCenter />
    ) : alignment === "right" ? (
      <AlignRight />
    ) : alignment === "justify" ? (
      <AlignJustify />
    ) : (
      <AlignLeft />
    );
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <PlateToolbarButton type="button" tooltip="Allineamento" isDropdown>
            {icon}
          </PlateToolbarButton>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => align("left")}>
            <AlignLeft /> Sinistra
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => align("center")}>
            <AlignCenter /> Centro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => align("right")}>
            <AlignRight /> Destra
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => align("justify")}>
            <AlignJustify /> Giustificato
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LinkButtons({ activeLink, onLink }: { activeLink: boolean; onLink: () => void }) {
  const editor = useEditorRef();
  return (
    <>
      <ToolbarButton
        active={activeLink}
        label={activeLink ? "Rimuovi collegamento" : "Inserisci collegamento"}
        onClick={() => {
          if (activeLink) {
            unwrapLink(editor, { split: true });
            editor.tf.focus();
          } else onLink();
        }}
      >
        <Link2 />
      </ToolbarButton>
    </>
  );
}

function LinkDialog({
  open,
  onOpenChange,
  text,
  href,
  onTextChange,
  onHrefChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: string;
  href: string;
  onTextChange: (value: string) => void;
  onHrefChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Inserisci collegamento</DialogTitle>
            <DialogDescription>Scrivi il testo visibile e l’indirizzo da aprire.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="plate-link-text">Testo</FieldLabel>
              <Input
                id="plate-link-text"
                value={text}
                onChange={(event) => onTextChange(event.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plate-link-href">Indirizzo</FieldLabel>
              <Input
                id="plate-link-href"
                value={href}
                placeholder="https://example.com"
                onChange={(event) => onHrefChange(event.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Annulla</DialogClose>
            <Button type="submit">Inserisci</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ImageDialog({
  open,
  onOpenChange,
  media,
  selectedMediaId,
  alt,
  caption,
  mediaType,
  onMediaChange,
  onAltChange,
  onCaptionChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: MediaItem[];
  selectedMediaId: string;
  alt: string;
  caption: string;
  mediaType: "audio" | "file" | "image" | "video";
  onMediaChange: (value: string) => void;
  onAltChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90dvh,56rem)] w-[calc(100%-2rem)] max-w-6xl flex-col sm:max-w-6xl">
        <form className="flex min-h-0 flex-1 flex-col gap-4" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Inserisci {mediaTypeLabel(mediaType)}</DialogTitle>
            <DialogDescription>Scegli un file dalla libreria media.</DialogDescription>
          </DialogHeader>
          <MediaBrowser
            items={media.filter((item) => mediaKind(item.mimeType) === mediaType)}
            value={selectedMediaId}
            onValueChange={onMediaChange}
          />
          <FieldGroup className="grid sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="plate-image-alt">Testo alternativo</FieldLabel>
              <Input
                id="plate-image-alt"
                value={alt}
                onChange={(event) => onAltChange(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plate-image-caption">Didascalia</FieldLabel>
              <Input
                id="plate-image-caption"
                value={caption}
                onChange={(event) => onCaptionChange(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Annulla</DialogClose>
            <Button type="submit" disabled={!selectedMediaId}>
              Inserisci
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function mediaKind(mimeType: string): "audio" | "file" | "image" | "video" {
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  return "file";
}

function mediaTypeLabel(type: "audio" | "file" | "image" | "video") {
  if (type === "audio") return "audio";
  if (type === "video") return "video";
  if (type === "file") return "file";
  return "immagine";
}

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}
