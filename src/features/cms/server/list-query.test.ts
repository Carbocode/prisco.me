// @vitest-environment node
import { DatabaseSync } from "node:sqlite";

import { sql } from "drizzle-orm";
import { SQLiteSyncDialect, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { listSearchSchema } from "../domain/list-search";
import { listOrder, listPage, listTextFilter } from "./list-query";

const items = sqliteTable("items", { id: text("id"), name: text("name") });
let database: DatabaseSync;
beforeEach(() => {
  database = new DatabaseSync(":memory:");
  database.exec(
    "CREATE TABLE items (id TEXT, name TEXT); INSERT INTO items VALUES ('a','Alpha'),('b','Beta'),('c','50%_literal'),('d','50XXliteral');",
  );
});
afterEach(() => database.close());
function run(statement: ReturnType<typeof sql>) {
  const compiled = new SQLiteSyncDialect().sqlToQuery(statement);
  const params = compiled.params.map((value) => {
    if (typeof value !== "string" && typeof value !== "number")
      throw new Error("Unexpected query parameter");
    return value;
  });
  return database.prepare(compiled.sql).all(...params);
}
describe("bounded management queries", () => {
  it("sorts before applying page limits", () => {
    const order = listOrder({ name: items.name }, "name", "desc", items.name);
    expect(run(sql`select id from items order by ${order} limit 1 offset 1`)).toEqual([
      { id: "a" },
    ]);
  });
  it("treats search wildcards as literal user text", () => {
    expect(run(sql`select id from items where ${listTextFilter("50%_", items.name)}`)).toEqual([
      { id: "c" },
    ]);
  });
  it("never interpolates an unrecognized sort key as SQL", () => {
    const order = listOrder({ name: items.name }, "name; DROP TABLE items;--", "asc", items.name);
    expect(run(sql`select id from items order by ${order} limit 1`)).toEqual([{ id: "c" }]);
    expect(run(sql`select count(*) as count from items`)).toEqual([{ count: 4 }]);
  });
  it("bounds requests and clamps pages after filters or deletion", () => {
    expect(listSearchSchema.parse({ pageSize: 100000, page: -1 }).pageSize).toBe(20);
    expect(listSearchSchema.parse({ page: -1 }).page).toBe(1);
    expect(listPage(100, 20, 22)).toBe(2);
    expect(listPage(2, 20, 0)).toBe(1);
  });
});
