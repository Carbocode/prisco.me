-- Optional load-test dataset. Apply scripts/seed-test.sql first and use the test D1 only.
WITH RECURSIVE
  entries(n) AS (
    VALUES (1)
    UNION ALL SELECT n + 1 FROM entries WHERE n < 2000
  ),
  paragraphs(n) AS (
    VALUES (1)
    UNION ALL SELECT n + 1 FROM paragraphs WHERE n < 25
  ),
  fixtures AS (
    SELECT n, CASE WHEN n <= 1200 OR n BETWEEN 1501 AND 1900 THEN 'articolo' ELSE 'progetto' END AS kind,
      CASE WHEN n <= 1500 THEN 'published' ELSE 'draft' END AS status,
      CASE n % 6
        WHEN 0 THEN 'Accessibilità'
        WHEN 1 THEN 'Architettura'
        WHEN 2 THEN 'Analisi dei dati'
        WHEN 3 THEN 'Design'
        WHEN 4 THEN 'Prestazioni'
        ELSE 'Sviluppo'
      END AS topic
    FROM entries
  )
INSERT INTO cms_articles (
  id, title, slug, excerpt, content, content_version, reading_time_minutes, status,
  published_at, author_id, last_edited_by_id, no_index, project_sort_order
)
SELECT
  printf('test-load-%04d', n),
  printf('%s fittizio %04d · %s', CASE kind WHEN 'articolo' THEN 'Articolo' ELSE 'Progetto' END, n, topic),
  printf('%s-carico-%04d', kind, n),
  printf('Contenuto fittizio sul tema %s per verificare gli archivi e il CMS con molti record.', topic),
  (
    SELECT json_object('type', 'doc', 'content', json_group_array(json_object(
      'type', 'p', 'children', json_array(json_object('text', printf(
        'Sezione %d. Questo esempio di %s tratta %s in un contesto immaginario. Il gruppo di lavoro ha confrontato diverse soluzioni, raccolto osservazioni e documentato il risultato in una breve analisi. La verifica comprende esempi, vincoli del progetto e casi limite.',
        paragraphs.n, fixtures.kind, fixtures.topic
      )))
    )))
    FROM paragraphs
    WHERE paragraphs.n <= 5 + fixtures.n % 21
  ),
  2, 2 + n % 7, status,
  CASE WHEN status = 'published' THEN 1704067200000 - ((n - 1) * 86400000) END,
  'test-fixture-author', 'test-fixture-author', 1, n
FROM fixtures
WHERE EXISTS (SELECT 1 FROM user WHERE id = 'test-fixture-author')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cms_article_categories (article_id, category_id)
SELECT article.id, category.id
FROM cms_articles AS article
JOIN cms_categories AS category ON category.deleted_at IS NULL AND category.slug =
  CASE WHEN article.slug LIKE 'articolo-carico-%' THEN 'blog' ELSE 'progetti' END
WHERE article.id GLOB 'test-load-[0-9][0-9][0-9][0-9]' AND article.deleted_at IS NULL
ON CONFLICT DO NOTHING;

WITH topics(n, name, slug) AS (
  VALUES (0, 'Accessibilità', 'accessibilita'), (1, 'Architettura', 'architettura'),
    (2, 'Analisi dei dati', 'dati'), (3, 'Design', 'design'),
    (4, 'Prestazioni', 'prestazioni'), (5, 'Sviluppo', 'sviluppo')
)
INSERT INTO cms_tags (id, name, slug, category_id)
SELECT printf('test-load-%s-%d', category.slug, topics.n),
  printf('%s di prova (%s)', topics.name, category.name),
  printf('test-%s-%s', category.slug, topics.slug), category.id
FROM cms_categories AS category CROSS JOIN topics
WHERE category.slug IN ('blog', 'progetti') AND category.deleted_at IS NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO cms_article_tags (article_id, tag_id)
SELECT article.id, tag.id
FROM cms_articles AS article
JOIN cms_article_categories AS link ON link.article_id = article.id
JOIN cms_categories AS category ON category.id = link.category_id
JOIN cms_tags AS tag ON tag.category_id = category.id AND tag.deleted_at IS NULL
  AND tag.id = printf('test-load-%s-%d', category.slug, CAST(substr(article.id, -4) AS INTEGER) % 6)
WHERE article.id GLOB 'test-load-[0-9][0-9][0-9][0-9]' AND article.deleted_at IS NULL
ON CONFLICT DO NOTHING;
