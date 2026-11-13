"use client";

import { useDraggable, useDropLine } from "@platejs/dnd";
import { useComposedRef } from "@udecode/cn";
import { Copy, Eraser, GripVertical, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { isType, KEYS } from "platejs";
import {
  type PlateElementProps,
  type RenderNodeWrapper,
  useEditorRef,
  useElement,
} from "platejs/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { useEditorActions } from "../editor-actions-context";
import { INSERT_GROUPS, TURN_INTO_GROUPS } from "../insert-items";

const UNDRAGGABLE_KEYS = [KEYS.column, KEYS.tr, KEYS.td];

export const BlockDraggable: RenderNodeWrapper = (props) => {
  const { editor, element, path } = props;

  const enabled = React.useMemo(() => {
    if (editor.dom.readOnly) return false;

    if (path.length === 1 && !isType(editor, element, UNDRAGGABLE_KEYS)) {
      return true;
    }
    if (path.length === 3 && !isType(editor, element, UNDRAGGABLE_KEYS)) {
      return editor.api.some({ at: path, match: { type: editor.getType(KEYS.column) } });
    }
    if (path.length === 4 && !isType(editor, element, UNDRAGGABLE_KEYS)) {
      return editor.api.some({ at: path, match: { type: editor.getType(KEYS.table) } });
    }

    return false;
  }, [editor, element, path]);

  if (!enabled) return undefined;

  return (draggableProps) => <Draggable {...draggableProps} />;
};

function Draggable(props: PlateElementProps) {
  const { children, element, path } = props;
  const { isDragging, nodeRef, previewRef, handleRef } = useDraggable({ element });
  const ref = useComposedRef<HTMLDivElement>(nodeRef, previewRef);

  const isInColumn = path.length === 3;
  const isInTable = path.length === 4;

  return (
    <div className={cn("group/block relative", isDragging && "opacity-50")}>
      {!isInTable && (
        <div
          className={cn(
            "slate-gutterLeft absolute top-0 left-0 z-50 flex -translate-x-full items-center pr-1",
            "cms-block-controls transition-opacity",
            isInColumn && "pr-1.5",
          )}
          contentEditable={false}
        >
          <AddBlockButton />
          <Button
            ref={handleRef}
            type="button"
            size="icon-sm"
            variant="ghost"
            data-plate-prevent-deselect
            aria-label="Trascina il blocco"
          >
            <GripVertical />
          </Button>
          <BlockMenu />
        </div>
      )}

      <div className="slate-blockWrapper flow-root" ref={ref}>
        {children}
        <DropLine />
      </div>
    </div>
  );
}

function AddBlockButton() {
  const editor = useEditorRef();
  const element = useElement();
  const { onMedia, onEmbed } = useEditorActions();
  const [open, setOpen] = React.useState(false);

  const focusBlock = () => {
    const path = editor.api.findPath(element);
    if (path) {
      const end = editor.api.end(path);
      if (end) editor.tf.select(end);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                  data-plate-prevent-deselect
                  aria-label="Inserisci un blocco"
                >
                  <Plus />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Inserisci un blocco</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="start"
        className="max-h-(--layout-max-h-viewport-content) w-56 overflow-y-auto"
      >
        {INSERT_GROUPS.map((group, index) => (
          <React.Fragment key={group.group}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              <DropdownMenuLabel>{group.group}</DropdownMenuLabel>
              {group.items.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    focusBlock();
                    item.run({ editor, onMedia, onEmbed });
                    editor.tf.focus();
                  }}
                >
                  {item.icon}
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BlockMenu() {
  const editor = useEditorRef();
  const element = useElement();
  const { onMedia, onEmbed } = useEditorActions();

  const focusBlock = () => {
    const path = editor.api.findPath(element);
    if (path) {
      const end = editor.api.end(path);
      if (end) editor.tf.select(end);
    }
  };

  const withPath = (fn: (path: number[]) => void) => {
    const path = editor.api.findPath(element);
    if (path) fn(path);
    editor.tf.focus();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            data-plate-prevent-deselect
            aria-label="Azioni blocco"
          >
            <MoreHorizontal />
          </Button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Trasforma in</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-(--layout-max-h-viewport-content) overflow-y-auto">
              <DropdownMenuGroup>
                {TURN_INTO_GROUPS.map((group, index) => (
                  <React.Fragment key={group.group}>
                    {index > 0 && <DropdownMenuSeparator />}
                    {group.items.map((item) => (
                      <DropdownMenuItem
                        key={item.label}
                        onClick={() => {
                          focusBlock();
                          item.turnInto?.({ editor, onMedia, onEmbed });
                        }}
                      >
                        {item.icon} {item.label}
                      </DropdownMenuItem>
                    ))}
                  </React.Fragment>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              withPath((path) => void navigator.clipboard.writeText(editor.api.string(path)))
            }
          >
            <Copy /> Copia testo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              withPath((path) => editor.tf.duplicateNodes({ nodes: [[element, path]] }))
            }
          >
            <Copy /> Duplica blocco
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              withPath((path) => {
                editor.tf.setNodes({ type: KEYS.p }, { at: path });
                editor.tf.unsetNodes(["checked", "indent", "listStyleType"], { at: path });
              })
            }
          >
            <Eraser /> Rimuovi formattazione
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => withPath((path) => editor.tf.removeNodes({ at: path }))}
          >
            <Trash2 /> Elimina blocco
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const DropLine = React.memo(function DropLine({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { dropLine } = useDropLine();

  if (!dropLine) return null;

  return (
    <div
      {...props}
      className={cn(
        "slate-dropLine",
        "absolute inset-x-0 z-50 h-0.5 rounded-full bg-primary opacity-100 transition-opacity",
        dropLine === "top" && "-top-px",
        dropLine === "bottom" && "-bottom-px",
        className,
      )}
    />
  );
});
