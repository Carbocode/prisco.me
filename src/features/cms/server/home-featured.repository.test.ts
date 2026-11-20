// @vitest-environment node
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

import { expect, it } from "vitest";

it("seeds the previous Home selection and enforces two unique positions per category", () => {
  using database = new DatabaseSync(":memory:");
  database.exec(`
    CREATE TABLE cms_articles (
      id TEXT PRIMARY KEY, status TEXT, published_at INTEGER,
      deleted_at INTEGER, project_sort_order INTEGER
    );
    CREATE TABLE cms_categories (id TEXT PRIMARY KEY, slug TEXT, deleted_at INTEGER);
    CREATE TABLE cms_article_categories (article_id TEXT, category_id TEXT);
    INSERT INTO cms_categories VALUES ('w', 'blog', NULL), ('p', 'progetti', NULL);
    INSERT INTO cms_articles VALUES
      ('older', 'published', 1000, NULL, 2),
      ('latest', 'published', 2000, NULL, 1),
      ('third', 'published', 500, NULL, 3),
      ('draft', 'draft', 9000, NULL, 0),
      ('future', 'scheduled', 9999999999999, NULL, 0);
    INSERT INTO cms_article_categories SELECT id, 'w' FROM cms_articles;
    INSERT INTO cms_article_categories SELECT id, 'p' FROM cms_articles;
  `);
  database.exec(readFileSync("drizzle/0034_home_featured.sql", "utf8"));

  const rows = database.prepare(
    "SELECT category, position, article_id FROM cms_home_featured ORDER BY category, position",
  );
  expect(rows.all()).toEqual([
    { category: "blog", position: 1, article_id: "latest" },
    { category: "progetti", position: 1, article_id: "latest" },
    { category: "progetti", position: 2, article_id: "older" },
  ]);

  const insert = database.prepare("INSERT INTO cms_home_featured VALUES (?, ?, ?)");
  expect(() => insert.run("progetti", 3, "third")).toThrow(/CHECK/);
  expect(() => insert.run("progetti", 2, "third")).toThrow(/UNIQUE/);
  expect(() => insert.run("blog", 2, "latest")).toThrow(/UNIQUE/);
  expect(() => insert.run("other", 1, "third")).toThrow(/CHECK/);
  expect(() => insert.run("blog", 2, "missing")).toThrow(/FOREIGN KEY/);
  insert.run("blog", 2, "older");
  database.exec("DELETE FROM cms_articles WHERE id = 'older'");
  expect(rows.all()).toHaveLength(2);
});
