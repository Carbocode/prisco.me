-- This fixture is applied only to the test environment after D1 migrations.
INSERT INTO user (id, name, email, role, created_at, updated_at)
VALUES ('test-fixture-author', 'Autrice di esempio', 'autrice@example.invalid', 'user', 1704067200000, 1704067200000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cms_categories (id, name, slug, description)
VALUES ('test-fixture-blog', 'Blog', 'blog', 'Articoli fittizi per l’ambiente di test.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO cms_articles
  (id, title, slug, excerpt, content, content_version, status, published_at, author_id, last_edited_by_id, no_index)
VALUES
  ('test-fixture-post', 'Articolo di prova', 'articolo-di-prova', 'Un articolo fittizio per verificare il CMS.',
    '{"type":"doc","content":[{"type":"p","children":[{"text":"Questo contenuto esiste solo nell’ambiente di test."}]}]}',
    2, 'published', 1704067200000, 'test-fixture-author', 'test-fixture-author', 1),
  ('test-fixture-project', 'Progetto di prova', 'progetto-di-prova', 'Un progetto fittizio per verificare il portfolio.',
    '{"type":"doc","content":[{"type":"p","children":[{"text":"Questo progetto esiste solo nell’ambiente di test."}]}]}',
    2, 'published', 1704067200000, 'test-fixture-author', 'test-fixture-author', 1),
  ('test-fixture-draft', 'Bozza di prova', 'bozza-di-prova', 'Una bozza fittizia per verificare il flusso editoriale.',
    '{"type":"doc","content":[{"type":"p","children":[{"text":"Questa bozza esiste solo nell’ambiente di test."}]}]}',
    2, 'draft', NULL, 'test-fixture-author', 'test-fixture-author', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cms_article_categories (article_id, category_id)
SELECT fixture.id, category.id
FROM (SELECT 'test-fixture-post' AS id, 'blog' AS slug
      UNION ALL SELECT 'test-fixture-project', 'progetti'
      UNION ALL SELECT 'test-fixture-draft', 'blog') AS fixture
JOIN cms_categories AS category ON category.slug = fixture.slug AND category.deleted_at IS NULL
WHERE NOT EXISTS (SELECT 1 FROM cms_article_categories WHERE article_id = fixture.id);

INSERT INTO cms_home_featured (category, position, article_id)
SELECT c.slug, 2, links.article_id
FROM cms_article_categories AS links
JOIN cms_categories AS c ON c.id = links.category_id
WHERE links.article_id IN ('test-fixture-post', 'test-fixture-project')
ON CONFLICT DO NOTHING;
