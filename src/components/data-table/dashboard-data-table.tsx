import {
  useTable,
  flexRender,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  type ColumnDef,
  type PaginationState,
  type RowData,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  RefreshCw,
  Search,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
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
type DashboardDataTableProps<TData extends RowData> = {
  columns: DashboardColumnDef<TData>[];
  data: TData[];
  getRowId?: (row: TData) => string;
  initialPageSize?: number;
  pagination?: ControlledPagination;
  sorting?: { value: SortingState; onChange: (value: SortingState) => void };
  search?: { value: string; onChange: (value: string) => void; placeholder?: string };
  onRefresh?: () => Promise<unknown>;
  toolbarLeft?: ReactNode;
  toolbarCenter?: ReactNode;
};
export type DashboardColumnDef<TData extends RowData> = ColumnDef<
  typeof dashboardTableFeatures,
  TData
>;
const pageSizeOptions = [10, 20, 50];
const dashboardTableFeatures = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
  rowSortingFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

export function DashboardDataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  initialPageSize = 10,
  pagination: controlledPagination,
  sorting,
  search,
  onRefresh,
  toolbarLeft,
  toolbarCenter,
}: DashboardDataTableProps<TData>) {
  const [refreshing, setRefreshing] = useState(false);
  async function refresh() {
    if (!onRefresh || refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } catch {
      toast.error("Aggiornamento non riuscito");
    } finally {
      setRefreshing(false);
    }
  }
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
    const current = {
      pageIndex: currentPagination.pageIndex,
      pageSize: currentPagination.pageSize,
    };
    currentPagination.onChange(typeof updater === "function" ? updater(current) : updater);
  };
  const table = useTable(
    {
      features: dashboardTableFeatures,
      data,
      columns,
      defaultColumn: { size: 180, minSize: 100, maxSize: 600, enableSorting: Boolean(sorting) },
      columnResizeMode: "onEnd",
      getRowId,
      manualPagination: Boolean(controlledPagination),
      manualSorting: true,
      enableMultiSort: false,
      enableSortingRemoval: false,
      onSortingChange: (updater) => {
        if (sorting)
          sorting.onChange(typeof updater === "function" ? updater(sorting.value) : updater);
      },
      onPaginationChange: updatePagination,
      pageCount: currentPagination.pageCount,
      state: {
        sorting: sorting?.value ?? [],
        pagination: {
          pageIndex: currentPagination.pageIndex,
          pageSize: currentPagination.pageSize,
        },
      },
    },
    (state) => ({
      pagination: state.pagination,
      sorting: state.sorting,
      columnSizing: state.columnSizing,
      columnVisibility: state.columnVisibility,
      columnOrder: state.columnOrder,
      columnPinning: state.columnPinning,
    }),
  );
  const allColumns = table.getAllLeafColumns();
  const columnGroupIds = (id: string) => {
    const pinned = table.getColumn(id)?.getIsPinned();
    return pinned
      ? table.state.columnPinning[pinned]
      : allColumns.filter((column) => !column.getIsPinned()).map((column) => column.id);
  };
  const moveColumn = (id: string, delta: number) => {
    const ids = [...columnGroupIds(id)];
    const index = ids.indexOf(id);
    const target = index + delta;
    if (index < 0 || target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    const pinned = table.getColumn(id)?.getIsPinned();
    if (pinned) table.setColumnPinning((current) => ({ ...current, [pinned]: ids }));
    else
      table.setColumnOrder([
        ...table.state.columnPinning.start,
        ...ids,
        ...table.state.columnPinning.end,
      ]);
  };
  const rows = table.getRowModel().rows;
  const firstItem = currentPagination.total
    ? currentPagination.pageIndex * currentPagination.pageSize + 1
    : 0;
  const lastItem = Math.min(
    (currentPagination.pageIndex + 1) * currentPagination.pageSize,
    currentPagination.total,
  );
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3">
      <div
        data-slot="table-toolbar"
        className="flex min-w-0 flex-wrap items-center justify-between gap-3"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-2">{toolbarLeft}</div>
        <div className="flex min-w-0 flex-1 justify-center overflow-x-auto">{toolbarCenter}</div>
        <div className="flex min-w-0 w-full items-center gap-2 sm:w-80">
          {search ? (
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                maxLength={160}
                aria-label="Cerca"
                placeholder={search.placeholder ?? "Cerca…"}
                value={search.value}
                onChange={(event) => search.onChange(event.target.value)}
              />
            </InputGroup>
          ) : null}
          {onRefresh ? (
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Aggiorna tabella"
              title="Aggiorna tabella"
              disabled={refreshing}
              aria-busy={refreshing}
              onClick={() => void refresh()}
            >
              {refreshing ? <Spinner /> : <RefreshCw />}
            </Button>
          ) : null}
        </div>
      </div>
      <Table
        className="table-fixed w-(--dynamic-width)"
        style={{ "--dynamic-width": table.getTotalSize() + "px" }}
      >
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "relative w-(--dynamic-width)",
                    header.column.getIsPinned() && "sticky isolate z-2",
                    header.column.getIsPinned() === "start" && "start-(--dynamic-start)",
                    header.column.getIsPinned() === "end" && "end-(--dynamic-end)",
                  )}
                  style={{
                    "--dynamic-width": header.column.getSize() + "px",
                    "--dynamic-start": header.column.getStart("start") + "px",
                    "--dynamic-end": header.column.getAfter("end") + "px",
                  }}
                >
                  {header.column.getIsPinned() ? (
                    <div aria-hidden className="absolute inset-0 -z-1 bg-background" />
                  ) : null}
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => header.column.toggleSorting()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" ? (
                        <ArrowUp data-icon="inline-end" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ArrowDown data-icon="inline-end" />
                      ) : (
                        <ArrowUpDown data-icon="inline-end" />
                      )}
                    </Button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                  {header.column.getCanResize() ? (
                    <button
                      type="button"
                      aria-label={`Ridimensiona colonna ${typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : header.column.id}`}
                      className="absolute inset-y-0 right-0 w-1 cursor-col-resize touch-none select-none hover:bg-border focus-visible:bg-ring focus-visible:outline-none data-[resizing=true]:bg-ring"
                      data-resizing={header.column.getIsResizing()}
                      onDoubleClick={() => header.column.resetSize()}
                      onKeyDown={(event) => {
                        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                        event.preventDefault();
                        const delta = event.key === "ArrowRight" ? 10 : -10;
                        table.setColumnSizing((sizes) => ({
                          ...sizes,
                          [header.column.id]: header.column.getSize() + delta,
                        }));
                      }}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                    />
                  ) : null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "relative overflow-hidden w-(--dynamic-width)",
                      cell.column.getIsPinned() && "sticky isolate z-2",
                      cell.column.getIsPinned() === "start" && "start-(--dynamic-start)",
                      cell.column.getIsPinned() === "end" && "end-(--dynamic-end)",
                    )}
                    style={{
                      "--dynamic-width": cell.column.getSize() + "px",
                      "--dynamic-start": cell.column.getStart("start") + "px",
                      "--dynamic-end": cell.column.getAfter("end") + "px",
                    }}
                  >
                    {cell.column.getIsPinned() ? (
                      <div aria-hidden className="absolute inset-0 -z-1 bg-background" />
                    ) : null}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length}>
                Nessun risultato.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div
        data-slot="table-footer-controls"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button type="button" variant="outline" size="sm" />}>
              <Columns3 data-icon="inline-start" />
              Colonne
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {allColumns.map((column) => (
                  <DropdownMenuSub key={column.id}>
                    <DropdownMenuSubTrigger>
                      {typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : column.id === "actions"
                          ? "Azioni"
                          : column.id}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuCheckboxItem
                          checked={column.getIsVisible()}
                          disabled={
                            !column.getCanHide() ||
                            (column.getIsVisible() && table.getVisibleLeafColumns().length === 1)
                          }
                          onCheckedChange={(value) => column.toggleVisibility(value)}
                        >
                          Visibile
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuItem
                          disabled={columnGroupIds(column.id).indexOf(column.id) === 0}
                          onClick={() => moveColumn(column.id, -1)}
                        >
                          Sposta a sinistra
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={
                            columnGroupIds(column.id).indexOf(column.id) ===
                            columnGroupIds(column.id).length - 1
                          }
                          onClick={() => moveColumn(column.id, 1)}
                        >
                          Sposta a destra
                        </DropdownMenuItem>
                        {column.getCanPin() ? (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => column.pin("start")}>
                              Fissa a sinistra
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => column.pin("end")}>
                              Fissa a destra
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={!column.getIsPinned()}
                              onClick={() => column.pin(false)}
                            >
                              Sblocca
                            </DropdownMenuItem>
                          </>
                        ) : null}
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    table.resetColumnVisibility();
                    table.resetColumnOrder();
                    table.resetColumnPinning();
                    table.resetColumnSizing();
                  }}
                >
                  Ripristina colonne
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
