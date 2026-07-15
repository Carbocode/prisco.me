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
import { toggleCodeBlock } from "@platejs/code-block";
import { CodeBlockPlugin, CodeLinePlugin } from "@platejs/code-block/react";
import { DndPlugin, useDndNode, useDropLine } from "@platejs/dnd";
import { IndentPlugin } from "@platejs/indent/react";
import { insertLink, unwrapLink, upsertLink } from "@platejs/link";
import { LinkPlugin } from "@platejs/link/react";
import { someList, toggleList } from "@platejs/list";
import { ListPlugin } from "@platejs/list/react";
import {
  deleteColumn,
  deleteRow,
  deleteTable,
  insertTable,
  insertTableColumn,
  insertTableRow,
} from "@platejs/table";
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@platejs/table/react";
import { insertToc } from "@platejs/toc";
import { TocPlugin, useTocElement, useTocElementState } from "@platejs/toc/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AudioLines,
  Baseline,
  Bold,
  Braces,
  ChevronsUpDown,
  Code2,
  Copy,
  Eraser,
  FileUp,
  GripVertical,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  MessageSquarePlus,
  Minus,
  MoreVertical,
  PaintBucket,
  PencilLine,
  Quote,
  SmilePlus,
  Strikethrough,
  Table2,
  TableOfContents,
  Trash2,
  Underline,
  Video,
} from "lucide-react";
import { KEYS, type TElement, type Value } from "platejs";
import {
  ParagraphPlugin,
  Plate,
  PlateElement,
  PlateLeaf,
  createPlatePlugin,
  useEditorRef,
  useEditorSelector,
  useNodePath,
  usePlateEditor,
  type PlateElementProps,
  type RenderNodeWrapperProps,
} from "platejs/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { FontColorToolbarButton } from "@/components/ui/font-color-toolbar-button";
import { RedoToolbarButton, UndoToolbarButton } from "@/components/ui/history-toolbar-button";
import { IndentToolbarButton, OutdentToolbarButton } from "@/components/ui/indent-toolbar-button";
import { Input } from "@/components/ui/input";
import { LineHeightToolbarButton } from "@/components/ui/line-height-toolbar-button";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { MoreToolbarButton } from "@/components/ui/more-toolbar-button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToolbarButton as PlateToolbarButton, ToolbarGroup } from "@/components/ui/toolbar";
import { TurnIntoToolbarButton } from "@/components/ui/turn-into-toolbar-button";

import { fromPlateValue, toPlateValue, type CmsDocument } from "../domain/cms-document";

type MediaItem = { id: string; filename: string; url: string; altText: string | null };
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

function CodeBlockElement(props: PlateElementProps) {
  return (
    <PlateElement {...props} as="pre">
      <code>{props.children}</code>
    </PlateElement>
  );
}

function CodeLineElement(props: PlateElementProps) {
  return <PlateElement {...props} as="div" />;
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

function ToggleElement(props: PlateElementProps) {
  return (
    <PlateElement {...props} as="details">
      <summary contentEditable={false}>Dettagli</summary>
      <div>{props.children}</div>
    </PlateElement>
  );
}

function LinkElement(props: PlateElementProps) {
  const element = props.element as TElement & { url?: string };
  return (
    <PlateElement
      {...props}
      as="a"
      attributes={{
        ...props.attributes,
        href: safeHref(element.url),
        onClick: (event: ReactMouseEvent<HTMLAnchorElement>) => event.preventDefault(),
      }}
    />
  );
}

function CommentLeaf(props: React.ComponentProps<typeof PlateLeaf>) {
  const comment = typeof props.leaf.comment === "string" ? props.leaf.comment : "Commento";
  return (
    <span title={comment}>
      <PlateLeaf {...props} className="cms-editor__comment" />
    </span>
  );
}

function SuggestionLeaf(props: React.ComponentProps<typeof PlateLeaf>) {
  return <PlateLeaf {...props} className="cms-editor__suggestion" />;
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

function MediaImageElement(props: PlateElementProps) {
  const media = useContext(MediaContext);
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
      <span contentEditable={false}>
        {item && mediaType === "image" ? (
          <img src={item.url} alt={element.alt || item.altText || ""} />
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
        {element.caption ? <figcaption>{element.caption}</figcaption> : null}
      </span>
      {props.children}
    </PlateElement>
  );
}

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

const ToggleBlockPlugin = createPlatePlugin({
  key: "toggle",
  node: { isElement: true },
}).withComponent(ToggleElement);

const CommentMarkPlugin = createPlatePlugin({
  key: "comment",
  node: { isLeaf: true },
}).withComponent(CommentLeaf);

const SuggestionMarkPlugin = createPlatePlugin({
  key: "suggestion",
  node: { isLeaf: true },
}).withComponent(SuggestionLeaf);

function BlockDraggable(props: RenderNodeWrapperProps) {
  const editor = useEditorRef();
  const nodeRef = useRef<HTMLDivElement>(null);
  const { dragRef, isDragging } = useDndNode({ element: props.element, nodeRef });
  const dropLine = useDropLine({
    id: typeof props.element.id === "string" ? props.element.id : "",
  });
  const path = editor.api.findPath(props.element);

  if (!path || path.length !== 1) return undefined;

  function transform(type: string) {
    editor.tf.setNodes({ type }, { at: path });
    editor.tf.unsetNodes(["checked", "indent", "listStyleType"], { at: path });
    editor.tf.focus();
  }

  return (elementProps: PlateElementProps) => (
    <div
      ref={nodeRef}
      className="cms-plate-block"
      data-dragging={isDragging || undefined}
      data-drop-line={dropLine || undefined}
    >
      <div className="cms-plate-block-controls" contentEditable={false}>
        <Button
          ref={(node) => {
            dragRef(node);
          }}
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Trascina blocco"
          title="Trascina blocco"
        >
          <GripVertical />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" size="icon-sm" variant="ghost" aria-label="Azioni blocco" />
            }
          >
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Trasforma in</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => transform(KEYS.p)}>Paragrafo</DropdownMenuItem>
              <DropdownMenuItem onClick={() => transform(KEYS.h2)}>Titolo 2</DropdownMenuItem>
              <DropdownMenuItem onClick={() => transform(KEYS.h3)}>Titolo 3</DropdownMenuItem>
              <DropdownMenuItem onClick={() => transform(KEYS.h4)}>Titolo 4</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => void navigator.clipboard.writeText(editor.api.string(path))}
              >
                <Copy />
                Copia testo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.tf.duplicateNodes({ at: path })}>
                <Copy />
                Duplica blocco
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => transform(KEYS.p)}>
                <Eraser />
                Rimuovi formattazione blocco
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => editor.tf.removeNodes({ at: path })}
              >
                <Trash2 />
                Elimina blocco
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {elementProps.children}
    </div>
  );
}

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
  ListPlugin,
  CodeBlockPlugin.withComponent(CodeBlockElement),
  CodeLinePlugin.withComponent(CodeLineElement),
  LinkPlugin.withComponent(LinkElement),
  TablePlugin.withComponent(TableElement),
  TableRowPlugin.withComponent(TableRowElement),
  TableCellPlugin.withComponent(TableCellElement),
  TableCellHeaderPlugin.withComponent(TableHeaderElement),
  TocPlugin.configure({ options: { topOffset: 96 } }).withComponent(TocElement),
  MediaImagePlugin,
  ToggleBlockPlugin,
  CommentMarkPlugin,
  SuggestionMarkPlugin,
  DndPlugin.configure({
    options: { enableScroller: true },
    render: {
      aboveNodes: BlockDraggable,
      aboveSlate: ({ children }) => <DndProvider backend={HTML5Backend}>{children}</DndProvider>,
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
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [mediaType, setMediaType] = useState<"audio" | "file" | "image" | "video">("image");
  const [selectedMediaId, setSelectedMediaId] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const mediaMap = useMemo(() => new Map(media.map((item) => [item.id, item])), [media]);
  const editor = usePlateEditor({
    plugins: editorPlugins,
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- CMS nodes are validated before reaching Plate.
    value: toPlateValue(value) as Value,
  });
  const commentSelection = useRef(editor.selection);

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

  function openCommentDialog() {
    if (!editor.selection || editor.api.isCollapsed()) return;
    commentSelection.current = editor.selection;
    setCommentText("");
    setCommentDialogOpen(true);
  }

  function saveComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const comment = commentText.trim();
    if (!comment || !commentSelection.current) return;
    editor.tf.select(commentSelection.current);
    editor.tf.addMarks({ comment });
    editor.tf.collapse({ edge: "end" });
    editor.tf.focus();
    setCommentDialogOpen(false);
  }

  return (
    <Field>
      <FieldLabel htmlFor="cms-content-editor">Corpo</FieldLabel>
      <MediaContext.Provider value={mediaMap}>
        <Plate editor={editor} onValueChange={({ value: next }) => onChange(fromPlateValue(next))}>
          <div className="cms-editor">
            <FixedToolbar className="cms-editor__toolbar">
              <EditorToolbar
                onLink={openLinkDialog}
                onComment={openCommentDialog}
                onMedia={(type) => {
                  setMediaType(type);
                  setImageDialogOpen(true);
                }}
              />
            </FixedToolbar>
            <EditorContainer className="cms-editor__canvas">
              <Editor
                id="cms-content-editor"
                variant="none"
                className="cms-editor__content"
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
          <CommentDialog
            open={commentDialogOpen}
            text={commentText}
            onOpenChange={setCommentDialogOpen}
            onTextChange={setCommentText}
            onSubmit={saveComment}
          />
        </Plate>
      </MediaContext.Provider>
    </Field>
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

function EditorToolbar({
  onLink,
  onComment,
  onMedia,
}: {
  onLink: () => void;
  onComment: () => void;
  onMedia: (type: "audio" | "file" | "image" | "video") => void;
}) {
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
    <div className="flex w-full" aria-label="Formattazione testo">
      <ToolbarGroup>
        <UndoToolbarButton tooltip="Annulla" />
        <RedoToolbarButton tooltip="Ripristina" />
      </ToolbarGroup>

      <ToolbarGroup>
        <InsertMenu />
        <TurnIntoToolbarButton />
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
        <TableMenu active={state.table} />
        <EmojiMenu />
      </ToolbarGroup>

      <ToolbarGroup>
        <MediaButtons onMedia={onMedia} />
      </ToolbarGroup>

      <ToolbarGroup>
        <LineHeightToolbarButton />
        <OutdentToolbarButton />
        <IndentToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <MoreToolbarButton />
      </ToolbarGroup>

      <div className="grow" />

      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Evidenzia">
          <Highlighter />
        </MarkToolbarButton>
        <PlateToolbarButton type="button" tooltip="Aggiungi commento" onClick={onComment}>
          <MessageSquarePlus />
        </PlateToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <SuggestionModeButton />
      </ToolbarGroup>
    </div>
  );
}

function SuggestionModeButton() {
  const editor = useEditorRef();
  const pressed = useEditorSelector((current) => current.api.marks()?.suggestion === true, []);
  return (
    <PlateToolbarButton
      type="button"
      pressed={pressed}
      tooltip="Modalità suggerimento"
      onClick={() => {
        if (pressed) editor.tf.removeMarks("suggestion");
        else editor.tf.addMarks({ suggestion: true });
        editor.tf.focus();
      }}
    >
      <PencilLine />
    </PlateToolbarButton>
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
    <DropdownMenu>
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

function InsertMenu() {
  const editor = useEditorRef();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <PlateToolbarButton type="button" tooltip="Inserisci" isDropdown>
            Inserisci
          </PlateToolbarButton>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Blocchi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => editor.tf.toggleBlock(KEYS.blockquote)}>
            <Quote /> Citazione
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleCodeBlock(editor)}>
            <Braces /> Blocco di codice
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.tf.insertNodes({ type: KEYS.hr, children: [{ text: "" }] })}
          >
            <Minus /> Separatore
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.tf.setNodes({ type: "toggle" })}>
            <ChevronsUpDown /> Blocco espandibile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => insertToc(editor)}>
            <TableOfContents /> Indice
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const commonEmoji = ["😀", "😂", "😍", "🤔", "👍", "👏", "🎉", "❤️", "🔥", "✅", "🚀", "💡"];

function EmojiMenu() {
  const editor = useEditorRef();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <PlateToolbarButton type="button" tooltip="Emoji">
            <SmilePlus />
          </PlateToolbarButton>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup className="grid grid-cols-4">
          {commonEmoji.map((emoji) => (
            <DropdownMenuItem
              key={emoji}
              aria-label={`Inserisci ${emoji}`}
              onClick={() => {
                editor.tf.insertText(emoji);
                editor.tf.focus();
              }}
            >
              {emoji}
            </DropdownMenuItem>
          ))}
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
    <DropdownMenu>
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

function TableMenu({ active }: { active: boolean }) {
  const editor = useEditorRef();
  const focus = (action: () => void) => {
    action();
    editor.tf.focus();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <PlateToolbarButton type="button" pressed={active} tooltip="Tabella">
            <Table2 />
          </PlateToolbarButton>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Tabella</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              focus(() => insertTable(editor, { rowCount: 3, colCount: 3, header: true }))
            }
          >
            Inserisci tabella 3 × 3
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={!active} onClick={() => focus(() => insertTableRow(editor))}>
            Aggiungi riga
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!active}
            onClick={() => focus(() => insertTableColumn(editor))}
          >
            Aggiungi colonna
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!active} onClick={() => focus(() => deleteRow(editor))}>
            Elimina riga
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!active} onClick={() => focus(() => deleteColumn(editor))}>
            Elimina colonna
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            disabled={!active}
            onClick={() => focus(() => deleteTable(editor))}
          >
            Elimina tabella
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

function MediaButtons({
  onMedia,
}: {
  onMedia: (type: "audio" | "file" | "image" | "video") => void;
}) {
  return (
    <>
      <ToolbarButton label="Inserisci immagine" onClick={() => onMedia("image")}>
        <ImagePlus />
      </ToolbarButton>
      <ToolbarButton label="Inserisci video" onClick={() => onMedia("video")}>
        <Video />
      </ToolbarButton>
      <ToolbarButton label="Inserisci audio" onClick={() => onMedia("audio")}>
        <AudioLines />
      </ToolbarButton>
      <ToolbarButton label="Inserisci file" onClick={() => onMedia("file")}>
        <FileUp />
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
  const items = media.map((item) => ({ value: item.id, label: item.filename }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Inserisci {mediaTypeLabel(mediaType)}</DialogTitle>
            <DialogDescription>Scegli un file dalla libreria media.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>{mediaTypeLabel(mediaType)}</FieldLabel>
              <Select
                items={items}
                value={selectedMediaId}
                onValueChange={(value) => onMediaChange(value ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Scegli un’immagine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {media.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.filename}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
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

function CommentDialog({
  open,
  text,
  onOpenChange,
  onTextChange,
  onSubmit,
}: {
  open: boolean;
  text: string;
  onOpenChange: (open: boolean) => void;
  onTextChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Aggiungi commento</DialogTitle>
            <DialogDescription>Il commento resta associato al testo selezionato.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="plate-comment">Commento</FieldLabel>
              <Input
                id="plate-comment"
                value={text}
                onChange={(event) => onTextChange(event.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Annulla</DialogClose>
            <Button type="submit">Aggiungi commento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
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
