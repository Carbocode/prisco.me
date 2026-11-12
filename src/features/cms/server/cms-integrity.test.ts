// @vitest-environment node
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { MEDIA_USAGE_SQL } from "./media-usage";

let database: DatabaseSync;
beforeEach(() => {
  database = new DatabaseSync(":memory:");
  database.exec(`
    CREATE TABLE cms_articles (id TEXT PRIMARY KEY, version INTEGER, content TEXT, cover_media_id TEXT, organization_id TEXT);
    CREATE TABLE cms_article_revisions (id TEXT PRIMARY KEY, article_id TEXT, snapshot TEXT);
    CREATE TABLE cms_media (id TEXT PRIMARY KEY, deleted_at INTEGER);
    CREATE TABLE cms_categories (id TEXT PRIMARY KEY, slug TEXT, deleted_at INTEGER, hero_media_id TEXT);
    CREATE TABLE cms_article_categories (article_id TEXT, category_id TEXT);
    CREATE TABLE cms_tags (id TEXT PRIMARY KEY, category_id TEXT, deleted_at INTEGER);
    CREATE TABLE cms_article_tags (article_id TEXT, tag_id TEXT);
    CREATE TABLE cms_organizations (id TEXT PRIMARY KEY, deleted_at INTEGER);
  `);
  database.exec(readFileSync("drizzle/0033_cms_integrity.sql", "utf8"));
  database.exec(`
    INSERT INTO cms_categories VALUES ('category', 'blog', NULL, NULL), ('other', 'other', NULL, NULL);
    INSERT INTO cms_media VALUES ('media', NULL);
    INSERT INTO cms_articles VALUES ('article', 1, '{"type":"doc","content":[]}', NULL, NULL);
    INSERT INTO cms_article_categories VALUES ('article', 'category');
    INSERT INTO cms_tags VALUES ('tag', 'category', NULL);
    INSERT INTO cms_article_tags VALUES ('article', 'tag');
  `);
});
afterEach(() => database.close());

function batch(sql: string) {
  database.exec("BEGIN");
  try {
    database.exec(sql);
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

describe("CMS database integrity", () => {
  it("rejects a stale save before it can rewrite associations or create a revision", () => {
    database.exec("UPDATE cms_articles SET version = 2 WHERE id = 'article'");
    expect(() =>
      batch(`
      INSERT INTO cms_article_revisions VALUES ('revision', 'article', '{"version":1}');
      UPDATE cms_articles SET version = 2 WHERE id = 'article' AND version = 1;
      DELETE FROM cms_article_tags WHERE article_id = 'article';
      DELETE FROM cms_article_categories WHERE article_id = 'article';
      INSERT INTO cms_article_categories VALUES ('article', 'other');
    `),
    ).toThrow(/CONTENT_VERSION_CONFLICT/);
    expect(database.prepare("SELECT * FROM cms_article_categories").all()).toEqual([
      { article_id: "article", category_id: "category" },
    ]);
    expect(database.prepare("SELECT count(*) AS n FROM cms_article_revisions").get()?.n).toBe(0);
    expect(database.prepare("SELECT count(*) AS n FROM cms_article_tags").get()?.n).toBe(1);
  });
  it("rolls back a whole save when a related write is invalid", () => {
    expect(() =>
      batch(`
      INSERT INTO cms_article_revisions VALUES ('revision', 'article', '{"version":1}');
      UPDATE cms_articles SET version = 2 WHERE id = 'article';
      INSERT INTO cms_tags VALUES ('foreign', 'other', NULL);
      INSERT INTO cms_article_tags VALUES ('article', 'foreign');
    `),
    ).toThrow(/categoria selezionata/);
    expect(database.prepare("SELECT version FROM cms_articles").get()?.version).toBe(1);
    expect(database.prepare("SELECT count(*) AS n FROM cms_article_revisions").get()?.n).toBe(0);
  });
  it("protects media referenced only by a historical document", () => {
    const snapshot = JSON.stringify({
      version: 1,
      content: JSON.stringify({ type: "doc", content: [{ type: "mediaImage", mediaId: "media" }] }),
    });
    database
      .prepare("INSERT INTO cms_article_revisions VALUES ('revision', 'article', ?)")
      .run(snapshot);
    expect(() => database.exec("UPDATE cms_media SET deleted_at = 1 WHERE id = 'media'")).toThrow(
      /storico/,
    );
    expect(database.prepare("SELECT deleted_at FROM cms_media").get()?.deleted_at).toBeNull();
  });
  it("does not allow a trashed media to be reattached by a stale form", () => {
    database.exec("UPDATE cms_media SET deleted_at = 1 WHERE id = 'media'");
    expect(() =>
      database.exec("UPDATE cms_articles SET cover_media_id = 'media', version = 2"),
    ).toThrow(/Media non disponibile/);
    expect(() =>
      database.prepare("UPDATE cms_articles SET content = ?, version = 2").run(
        JSON.stringify({
          type: "doc",
          content: [{ type: "mediaImage", attrs: { mediaId: "media" } }],
        }),
      ),
    ).toThrow(/Media non disponibile/);
    expect(database.prepare("SELECT version FROM cms_articles").get()?.version).toBe(1);
  });
  it("protects used category URLs and prevents moving a used tag", () => {
    expect(() =>
      database.exec("UPDATE cms_categories SET deleted_at = 1 WHERE id = 'category'"),
    ).toThrow(/Riassegna/);
    expect(() =>
      database.exec("UPDATE cms_categories SET slug = 'renamed' WHERE id = 'category'"),
    ).toThrow(/slug/);
    expect(() =>
      database.exec("UPDATE cms_tags SET category_id = 'other' WHERE id = 'tag'"),
    ).toThrow(/associazioni/);
  });
  it("counts covers, nested document references and history without transferring documents", () => {
    const content = JSON.stringify({
      type: "doc",
      content: [{ type: "column", children: [{ type: "mediaImage", mediaId: "media" }] }],
    });
    database
      .prepare("UPDATE cms_articles SET version = 2, cover_media_id = 'media', content = ?")
      .run(content);
    database
      .prepare("INSERT INTO cms_article_revisions VALUES ('history', 'article', ?)")
      .run(JSON.stringify({ version: 2, coverMediaId: "media", content }));
    database.exec("UPDATE cms_categories SET hero_media_id = 'media' WHERE id = 'category'");
    expect(database.prepare(MEDIA_USAGE_SQL).get()).toEqual({
      mediaId: "media",
      articleCovers: 1,
      articleContent: 1,
      categoryHeroes: 1,
      revisions: 2,
    });
  });
  it("allows restoring an unused trashed media without changing article history", () => {
    database.exec(
      "UPDATE cms_media SET deleted_at = 1 WHERE id = 'media'; UPDATE cms_media SET deleted_at = NULL WHERE id = 'media'",
    );
    expect(database.prepare("SELECT deleted_at FROM cms_media").get()?.deleted_at).toBeNull();
    expect(database.prepare("SELECT version FROM cms_articles").get()?.version).toBe(1);
  });
});

describe("organization migration compatibility", () => {
  it("creates a new education organization against the real legacy table", async () => {
    const { drizzle } = await import("drizzle-orm/sqlite-proxy");
    const { cmsOrganizations } = await import("@/db/schema");
    const legacy = new DatabaseSync(":memory:");
    try {
      const source = readFileSync("drizzle/0018_migrate_portfolio_to_cms.sql", "utf8");
      legacy.exec(source.slice(source.indexOf("CREATE TABLE"), source.indexOf("ALTER TABLE")));
      legacy.exec(readFileSync("drizzle/0019_rename_organization_type.sql", "utf8"));
      const query = drizzle(async () => ({ rows: [] }))
        .insert(cmsOrganizations)
        .values({ name: "Audit education", slug: "audit-education", type: "education" })
        .toSQL();
      const params = query.params.map((value) => {
        if (value === null || typeof value === "string" || typeof value === "number") return value;
        throw new Error("Unexpected SQL parameter");
      });
      legacy.prepare(query.sql).run(...params);
      expect(
        legacy.prepare("SELECT organization_type FROM cms_organizations").get()?.organization_type,
      ).toBe("education");
    } finally {
      legacy.close();
    }
  });
});
