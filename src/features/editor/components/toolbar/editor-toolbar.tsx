import { unwrapLink } from "@platejs/link";
import { someList, toggleList } from "@platejs/list";
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
import { KEYS } from "platejs";
import { useEditorRef, useEditorSelector } from "platejs/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmojiToolbarButton } from "@/features/editor/components/toolbar/emoji-toolbar-button";
import { FontColorToolbarButton } from "@/features/editor/components/toolbar/font-color-toolbar-button";
import {
  RedoToolbarButton,
  UndoToolbarButton,
} from "@/features/editor/components/toolbar/history-toolbar-button";
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from "@/features/editor/components/toolbar/indent-toolbar-button";
import { LineHeightToolbarButton } from "@/features/editor/components/toolbar/line-height-toolbar-button";
import { MarkToolbarButton } from "@/features/editor/components/toolbar/mark-toolbar-button";
import { TableToolbarButton } from "@/features/editor/components/toolbar/table-toolbar-button";
import {
  ToolbarButton as PlateToolbarButton,
  ToolbarGroup,
} from "@/features/editor/components/toolbar/toolbar";

export function EditorToolbar({ onLink }: { onLink: () => void }) {
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
