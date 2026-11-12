export const MEDIA_USAGE_SQL = `
    WITH usages AS (
      SELECT cover_media_id AS mediaId, 1 AS covers, 0 AS content, 0 AS heroes, 0 AS revisions FROM cms_articles WHERE cover_media_id IS NOT NULL
      UNION ALL SELECT j.value, 0, 1, 0, 0 FROM cms_articles a, json_tree(a.content) j WHERE j.key = 'mediaId'
      UNION ALL SELECT hero_media_id, 0, 0, 1, 0 FROM cms_categories WHERE hero_media_id IS NOT NULL
      UNION ALL SELECT json_extract(snapshot, '$.coverMediaId'), 0, 0, 0, 1 FROM cms_article_revisions WHERE json_extract(snapshot, '$.coverMediaId') IS NOT NULL
      UNION ALL SELECT j.value, 0, 0, 0, 1 FROM cms_article_revisions r, json_tree(json_extract(r.snapshot, '$.content')) j WHERE j.key = 'mediaId'
    ) SELECT mediaId, SUM(covers) AS articleCovers, SUM(content) AS articleContent, SUM(heroes) AS categoryHeroes, SUM(revisions) AS revisions FROM usages GROUP BY mediaId
`;
