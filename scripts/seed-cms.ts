import { spawnSync } from "node:child_process";

const userId = process.argv[2];
if (!userId || !/^[0-9a-f-]{36}$/i.test(userId)) {
  console.error("Uso: bun run db:seed:cms <better-auth-user-id>");
  process.exit(1);
}
const doc = JSON.stringify({
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: "Contenuto dimostrativo del CMS." }] },
  ],
}).replaceAll("'", "''");
const sql = `
INSERT OR IGNORE INTO cms_categories (id,name,slug,created_at,updated_at) VALUES ('00000000-0000-4000-8000-000000000101','Tecnologia','tecnologia',unixepoch()*1000,unixepoch()*1000);
INSERT OR IGNORE INTO cms_articles (id,title,slug,excerpt,content,author_id,last_edited_by_id,status,published_at,created_at,updated_at) VALUES
('00000000-0000-4000-8000-000000000201','Bozza di esempio','bozza-di-esempio','Una bozza locale.','${doc}','${userId}','${userId}','draft',NULL,unixepoch()*1000,unixepoch()*1000),
('00000000-0000-4000-8000-000000000202','Articolo pubblicato','articolo-pubblicato','Un articolo pubblico locale.','${doc}','${userId}','${userId}','published',unixepoch()*1000,unixepoch()*1000,unixepoch()*1000),
('00000000-0000-4000-8000-000000000203','Articolo programmato','articolo-programmato','Un articolo programmato locale.','${doc}','${userId}','${userId}','scheduled',(unixepoch()+86400)*1000,unixepoch()*1000,unixepoch()*1000);
INSERT OR IGNORE INTO cms_article_categories (article_id,category_id) VALUES ('00000000-0000-4000-8000-000000000202','00000000-0000-4000-8000-000000000101');
INSERT OR IGNORE INTO cms_services (id,name,slug,short_description,content,status,published_at,sort_order,created_by_id,last_edited_by_id,created_at,updated_at) VALUES
('00000000-0000-4000-8000-000000000301','Consulenza tecnica','consulenza-tecnica','Supporto su architettura e sviluppo.','${doc}','published',unixepoch()*1000,10,'${userId}','${userId}',unixepoch()*1000,unixepoch()*1000),
('00000000-0000-4000-8000-000000000302','Product engineering','product-engineering','Dall’idea a un prodotto mantenibile.','${doc}','draft',NULL,20,'${userId}','${userId}',unixepoch()*1000,unixepoch()*1000);
PRAGMA optimize;`;
const result = spawnSync(
  "bunx",
  ["wrangler", "d1", "execute", "prisco-website", "--local", "--command", sql],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
