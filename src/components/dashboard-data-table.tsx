import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type PaginationState,
  type Row,
  type Updater,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ControlledPagination = {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  total: number;
  onChange: (pagination: PaginationState) => void;
};

type DashboardDataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  getRowId?: (row: TData) => string;
  initialPageSize?: number;
  pagination?: ControlledPagination;
  renderRow?: (row: Row<TData>) => React.ReactNode;
};

const pageSizeOptions = [10, 20, 50];

export function DashboardDataTable<TData>({
  columns,
  data,
  getRowId,
  initialPageSize = 10,
  pagination: controlledPagination,
  renderRow,
}: DashboardDataTableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const currentPagination = controlledPagination ?? {
    ...pagination,
    pageCount: Math.max(1, Math.ceil(data.length / pagination.pageSize)),
    total: data.length,
    onChange: setPagination,
  };

  const updatePagination = (updater: Updater<PaginationState>) => {
    const next = typeof updater === "function" ? updater(currentPagination) : updater;
    currentPagination.onChange(next);
  };

  const firstColumnId = columnId(columns[0], 0);
  const lastColumnId = columnId(columns.at(-1), columns.length - 1);
  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      size: 180,
      minSize: 100,
      maxSize: 600,
    },
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: controlledPagination ? undefined : getPaginationRowModel(),
    getRowId,
    manualPagination: Boolean(controlledPagination),
    onPaginationChange: updatePagination,
    pageCount: currentPagination.pageCount,
    state: {
      columnPinning: {
        left: firstColumnId ? [firstColumnId] : [],
        right: lastColumnId && lastColumnId !== firstColumnId ? [lastColumnId] : [],
      },
      pagination: {
        pageIndex: currentPagination.pageIndex,
        pageSize: currentPagination.pageSize,
      },
    },
  });

  const rows = table.getRowModel().rows;
  const firstItem = currentPagination.total
    ? currentPagination.pageIndex * currentPagination.pageSize + 1
    : 0;
  const lastItem = Math.min(
    (currentPagination.pageIndex + 1) * currentPagination.pageSize,
    currentPagination.total,
  );

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <Table
        className="min-w-full table-fixed [&_tbody_tr:hover>td:first-child:not(:only-child)]:bg-muted [&_tbody_tr:hover>td:last-child:not(:only-child)]:bg-muted [&_tbody_tr>td:first-child:not(:only-child)]:sticky [&_tbody_tr>td:first-child:not(:only-child)]:left-0 [&_tbody_tr>td:first-child:not(:only-child)]:bg-background [&_tbody_tr>td:first-child:not(:only-child)]:z-10 [&_tbody_tr>td:last-child:not(:only-child)]:sticky [&_tbody_tr>td:last-child:not(:only-child)]:right-0 [&_tbody_tr>td:last-child:not(:only-child)]:bg-background [&_tbody_tr>td:last-child:not(:only-child)]:z-10"
        style={{ width: table.getTotalSize() }}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const pinned = header.column.getIsPinned();
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "relative z-20 bg-background",
                      pinned === "left" && "sticky left-0",
                      pinned === "right" && "sticky right-0",
                    )}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanResize() ? (
                      <button
                        type="button"
                        aria-label={`Ridimensiona colonna ${String(header.column.columnDef.header ?? header.column.id)}`}
                        className="absolute inset-y-0 right-0 w-1 cursor-col-resize touch-none select-none hover:bg-border focus-visible:bg-ring focus-visible:outline-none data-[resizing=true]:bg-ring"
                        data-resizing={header.column.getIsResizing()}
                        onDoubleClick={() => header.column.resetSize()}
                        onKeyDown={(event) => {
                          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                          event.preventDefault();
                          const delta = event.key === "ArrowRight" ? 10 : -10;
                          table.setColumnSizing((sizing) => ({
                            ...sizing,
                            [header.column.id]: header.column.getSize() + delta,
                          }));
                        }}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      />
                    ) : null}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row) =>
            renderRow ? (
              renderRow(row)
            ) : (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const pinned = cell.column.getIsPinned();
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "overflow-hidden text-ellipsis",
                        pinned === "left" && "sticky left-0 bg-background",
                        pinned === "right" && "sticky right-0 bg-background",
                      )}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="tabular-nums">
            {firstItem}–{lastItem} di {currentPagination.total}
          </span>
          <Select
            items={pageSizeOptions.map((size) => ({ value: String(size), label: String(size) }))}
            value={String(currentPagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value ?? initialPageSize))}
          >
            <SelectTrigger size="sm" aria-label="Righe per pagina">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} righe
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Pagina precedente"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <ChevronLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm tabular-nums" aria-live="polite">
                Pagina {currentPagination.pageIndex + 1} di {currentPagination.pageCount}
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Pagina successiva"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <ChevronRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

function columnId<TData>(column: ColumnDef<TData> | undefined, index: number) {
  if (!column) return undefined;
  if ("id" in column && column.id) return column.id;
  if ("accessorKey" in column && typeof column.accessorKey === "string") return column.accessorKey;
  return `column-${index}`;
}
