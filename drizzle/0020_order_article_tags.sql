ALTER TABLE cms_article_tags ADD sort_order integer DEFAULT 0 NOT NULL;
--> statement-breakpoint

-- Per i progetti importati conserva l'ordine delle skill legacy. Per gli altri
-- articoli assegna un ordine deterministico basato sul nome del tag.
UPDATE cms_article_tags
SET sort_order = coalesce(
  (
    SELECT project_skill.sort_order
    FROM cms_articles article
    JOIN cms_tags tag ON tag.id = cms_article_tags.tag_id
    JOIN project_skills project_skill
      ON project_skill.project_id = article.legacy_project_id
     AND project_skill.skill_id = tag.legacy_skill_id
    WHERE article.id = cms_article_tags.article_id
    LIMIT 1
  ),
  (
    SELECT count(*) - 1
    FROM cms_article_tags sibling
    JOIN cms_tags sibling_tag ON sibling_tag.id = sibling.tag_id
    JOIN cms_tags current_tag ON current_tag.id = cms_article_tags.tag_id
    WHERE sibling.article_id = cms_article_tags.article_id
      AND (
        sibling_tag.name < current_tag.name
        OR (
          sibling_tag.name = current_tag.name
          AND sibling.tag_id <= cms_article_tags.tag_id
        )
      )
  )
);
--> statement-breakpoint

CREATE INDEX cms_article_tags_article_order_idx
ON cms_article_tags (article_id, sort_order);
