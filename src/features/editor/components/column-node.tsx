"use client";

import { setColumns } from "@platejs/layout";
import { Trash2Icon } from "lucide-react";
import type { TColumnElement } from "platejs";
import type { PlateElementProps } from "platejs/react";
import {
  PlateElement,
  useEditorRef,
  useEditorSelector,
  useElement,
  useReadOnly,
  useRemoveNodeButton,
  useSelected,
} from "platejs/react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function ColumnGroupElement(props: PlateElementProps) {
  return (
    <PlateElement className="mb-2" {...props}>
      <ColumnFloatingToolbar>
        <div className="flex size-full gap-4 rounded">{props.children}</div>
      </ColumnFloatingToolbar>
    </PlateElement>
  );
}

function ColumnFloatingToolbar({ children }: { children: React.ReactNode }) {
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const element = useElement<TColumnElement>();
  const { props: buttonProps } = useRemoveNodeButton({ element });
  const selected = useSelected();
  const isCollapsed = useEditorSelector((ed) => ed.api.isCollapsed(), []);

  const open = !readOnly && selected && isCollapsed;

  const onColumnChange = (widths: string[]) => {
    setColumns(editor, { at: element, widths });
  };

  return (
    <Popover open={open}>
      <PopoverTrigger render={<div>{children}</div>} />
      <PopoverContent align="center" className="w-auto p-1" side="top" sideOffset={10}>
        <div className="box-content flex h-8 items-center gap-1">
          <Button className="size-8" onClick={() => onColumnChange(["50%", "50%"])} variant="ghost">
            2
          </Button>
          <Button
            className="size-8"
            onClick={() => onColumnChange(["33%", "33%", "33%"])}
            variant="ghost"
          >
            3
          </Button>
          <Button className="size-8" onClick={() => onColumnChange(["70%", "30%"])} variant="ghost">
            ⬛▪
          </Button>
          <Button className="size-8" onClick={() => onColumnChange(["30%", "70%"])} variant="ghost">
            ▪⬛
          </Button>
          <Separator className="mx-1 h-6" orientation="vertical" />
          <Button className="size-8" variant="ghost" {...buttonProps}>
            <Trash2Icon />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ColumnElement(props: PlateElementProps<TColumnElement>) {
  const { width } = props.element;
  const readOnly = useReadOnly();

  return (
    <PlateElement
      className={cn(
        "min-w-0 border border-transparent p-1.5",
        !readOnly && "rounded-lg border-border border-dashed",
      )}
      style={{ width: width ?? "100%" }}
      {...props}
    >
      {props.children}
    </PlateElement>
  );
}
