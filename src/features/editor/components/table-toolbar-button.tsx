"use client";

import {
  deleteColumn,
  deleteRow,
  deleteTable,
  insertTable,
  insertTableColumn,
  insertTableRow,
} from "@platejs/table";
import { TablePlugin } from "@platejs/table/react";
import { Grid2x2PlusIcon, Table2, Trash2, Grid3x3Icon } from "lucide-react";
import { useEditorPlugin, useEditorSelector } from "platejs/react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { ToolbarButton } from "./toolbar";

const MAX = 8;

export function TableToolbarButton() {
  const { editor } = useEditorPlugin(TablePlugin);
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState({ rows: 0, cols: 0 });

  const inTable = useEditorSelector(
    (ed) => ed.api.some({ match: (node) => "type" in node && node.type === "table" }),
    [],
  );

  const focus = (action: () => void) => {
    action();
    editor.tf.focus();
  };

  const rows = Array.from({ length: MAX }, (_, i) => i + 1);
  const cols = Array.from({ length: MAX }, (_, i) => i + 1);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger
        render={
          <ToolbarButton type="button" pressed={open || inTable} tooltip="Tabella" isDropdown>
            <Table2 />
          </ToolbarButton>
        }
      />
      <DropdownMenuContent align="start" className="w-auto! min-w-[220px] p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {size.rows > 0 ? `Inserisci tabella ${size.rows} × ${size.cols}` : "Inserisci tabella"}
          </DropdownMenuLabel>
          <div
            className="grid w-fit gap-1 p-1"
            style={{ gridTemplateColumns: `repeat(${MAX}, 20px)` }}
            onMouseLeave={() => setSize({ rows: 0, cols: 0 })}
          >
            {rows.map((r) =>
              cols.map((c) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  aria-label={`${r} × ${c}`}
                  className={cn(
                    "size-4 rounded-[3px] border border-border",
                    r <= size.rows && c <= size.cols ? "border-brand bg-brand/40" : "bg-muted/50",
                  )}
                  onMouseEnter={() => setSize({ rows: r, cols: c })}
                  onClick={() => {
                    focus(() => insertTable(editor, { rowCount: r, colCount: c, header: false }));
                    setOpen(false);
                  }}
                />
              )),
            )}
          </div>
          <DropdownMenuItem
            onClick={() =>
              focus(() => insertTable(editor, { rowCount: 3, colCount: 3, header: true }))
            }
          >
            <Grid3x3Icon /> Tabella 3 × 3 con intestazione
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={!inTable} onClick={() => focus(() => insertTableRow(editor))}>
            <Grid2x2PlusIcon /> Aggiungi riga
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!inTable}
            onClick={() => focus(() => insertTableColumn(editor))}
          >
            <Grid2x2PlusIcon /> Aggiungi colonna
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!inTable} onClick={() => focus(() => deleteRow(editor))}>
            <Trash2 /> Elimina riga
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!inTable} onClick={() => focus(() => deleteColumn(editor))}>
            <Trash2 /> Elimina colonna
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            disabled={!inTable}
            onClick={() => focus(() => deleteTable(editor))}
          >
            <Trash2 /> Elimina tabella
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
