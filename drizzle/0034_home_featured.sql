CREATE TABLE cms_home_featured (
  category TEXT NOT NULL,
  position INTEGER NOT NULL,
  article_id TEXT NOT NULL REFERENCES cms_articles(id) ON DELETE CASCADE,
  PRIMARY KEY (category, position),
  CONSTRAINT cms_home_featured_category_check CHECK (category IN ('blog', 'progetti')),
  CONSTRAINT cms_home_featured_position_check CHECK (position IN (1, 2))
);
--> statement-breakpoint
CREATE UNIQUE INDEX cms_home_featured_category_article_idx ON cms_home_featured(category, article_id);
--> statement-breakpoint
INSERT INTO cms_home_featured (category, position, article_id)
SELECT category, position, id
FROM (
  SELECT c.slug AS category,
    row_number() OVER (
      PARTITION BY c.slug
      ORDER BY
        CASE WHEN c.slug = 'progetti' THEN a.project_sort_order END,
        CASE WHEN c.slug = 'blog' THEN a.published_at END DESC,
        CASE WHEN c.slug = 'blog' THEN a.id END DESC,
        a.id
    ) AS position,
    a.id
  FROM cms_articles a
  JOIN cms_article_categories ac ON ac.article_id = a.id
  JOIN cms_categories c ON c.id = ac.category_id
  WHERE c.slug IN ('blog', 'progetti')
    AND c.deleted_at IS NULL
    AND a.deleted_at IS NULL
    AND a.status IN ('published', 'scheduled')
    AND a.published_at <= unixepoch() * 1000
)
WHERE position <= CASE category WHEN 'blog' THEN 1 ELSE 2 END;
