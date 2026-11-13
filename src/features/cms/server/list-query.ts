import { asc, desc, or, sql, type AnyColumn, type SQL } from "drizzle-orm";

export function listOrder(
  columns: Record<string, AnyColumn | SQL>,
  key: string,
  direction: "asc" | "desc",
  fallback: AnyColumn | SQL,
) {
  const column = Object.hasOwn(columns, key) ? columns[key] : fallback;
  return direction === "desc" ? desc(column) : asc(column);
}

/** Search literal text: % and _ entered by the user are not SQL wildcards. */
export function listTextFilter(query: string | undefined, ...columns: (AnyColumn | SQL)[]) {
  if (!query) return undefined;
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
  return or(...columns.map((column) => sql`${column} like ${pattern} escape '\\'`));
}

export function listPage(page: number, pageSize: number, total: number) {
  return Math.min(page, Math.max(1, Math.ceil(total / pageSize)));
}
