-- D1 batches are transactions. Reject a stale snapshot before any related writes.
CREATE TRIGGER cms_revision_version_guard BEFORE INSERT ON cms_article_revisions
WHEN CAST(json_extract(NEW.snapshot, '$.version') AS INTEGER) != (SELECT version FROM cms_articles WHERE id = NEW.article_id)
BEGIN SELECT RAISE(ABORT, 'CONTENT_VERSION_CONFLICT'); END;
--> statement-breakpoint
CREATE TRIGGER cms_article_version_guard BEFORE UPDATE ON cms_articles
WHEN NEW.version != OLD.version + 1
BEGIN SELECT RAISE(ABORT, 'CONTENT_VERSION_CONFLICT'); END;
--> statement-breakpoint
CREATE TRIGGER cms_media_archive_guard BEFORE UPDATE OF deleted_at ON cms_media
WHEN NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL AND (
 EXISTS (SELECT 1 FROM cms_articles a WHERE a.cover_media_id = OLD.id OR EXISTS (SELECT 1 FROM json_tree(a.content) j WHERE j.key = 'mediaId' AND j.value = OLD.id)) OR
 EXISTS (SELECT 1 FROM cms_categories WHERE hero_media_id = OLD.id) OR
 EXISTS (SELECT 1 FROM cms_article_revisions r, json_tree(r.snapshot) j WHERE j.key IN ('mediaId', 'coverMediaId') AND j.value = OLD.id) OR
 EXISTS (SELECT 1 FROM cms_article_revisions WHERE json_extract(snapshot, '$.content') LIKE '%' || OLD.id || '%')
)
BEGIN SELECT RAISE(ABORT, 'Il media è ancora utilizzato, anche nello storico'); END;
--> statement-breakpoint
CREATE TRIGGER cms_article_media_insert BEFORE INSERT ON cms_articles
WHEN (NEW.cover_media_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM cms_media WHERE id = NEW.cover_media_id AND deleted_at IS NULL)) OR EXISTS (SELECT 1 FROM json_tree(NEW.content) j WHERE j.key = 'mediaId' AND NOT EXISTS (SELECT 1 FROM cms_media WHERE id = j.value AND deleted_at IS NULL))
BEGIN SELECT RAISE(ABORT, 'Media non disponibile'); END;
--> statement-breakpoint
CREATE TRIGGER cms_article_media_update BEFORE UPDATE OF content, cover_media_id ON cms_articles
WHEN (NEW.cover_media_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM cms_media WHERE id = NEW.cover_media_id AND deleted_at IS NULL)) OR EXISTS (SELECT 1 FROM json_tree(NEW.content) j WHERE j.key = 'mediaId' AND NOT EXISTS (SELECT 1 FROM cms_media WHERE id = j.value AND deleted_at IS NULL))
BEGIN SELECT RAISE(ABORT, 'Media non disponibile'); END;
--> statement-breakpoint
CREATE TRIGGER cms_category_media_update BEFORE UPDATE OF hero_media_id ON cms_categories
WHEN NEW.hero_media_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM cms_media WHERE id = NEW.hero_media_id AND deleted_at IS NULL)
BEGIN SELECT RAISE(ABORT, 'Media non disponibile'); END;
--> statement-breakpoint
CREATE TRIGGER cms_category_archive_guard BEFORE UPDATE OF deleted_at ON cms_categories
WHEN NEW.deleted_at IS NOT NULL AND EXISTS (SELECT 1 FROM cms_article_categories WHERE category_id = OLD.id)
BEGIN SELECT RAISE(ABORT, 'Riassegna gli articoli prima di archiviare la categoria'); END;
--> statement-breakpoint
CREATE TRIGGER cms_category_slug_guard BEFORE UPDATE OF slug ON cms_categories
WHEN NEW.slug != OLD.slug AND EXISTS (SELECT 1 FROM cms_article_categories WHERE category_id = OLD.id)
BEGIN SELECT RAISE(ABORT, 'La categoria è utilizzata: lo slug non può essere modificato'); END;
--> statement-breakpoint
CREATE TRIGGER cms_article_category_guard BEFORE INSERT ON cms_article_categories
WHEN NOT EXISTS (SELECT 1 FROM cms_categories WHERE id = NEW.category_id AND deleted_at IS NULL)
BEGIN SELECT RAISE(ABORT, 'Categoria non disponibile'); END;
--> statement-breakpoint
CREATE TRIGGER cms_article_tag_guard BEFORE INSERT ON cms_article_tags
WHEN NOT EXISTS (SELECT 1 FROM cms_tags t JOIN cms_article_categories c ON c.category_id = t.category_id WHERE t.id = NEW.tag_id AND c.article_id = NEW.article_id AND t.deleted_at IS NULL)
BEGIN SELECT RAISE(ABORT, 'Il tag non appartiene alla categoria selezionata'); END;
--> statement-breakpoint
CREATE TRIGGER cms_tag_category_guard BEFORE UPDATE OF category_id ON cms_tags
WHEN NEW.category_id != OLD.category_id AND EXISTS (SELECT 1 FROM cms_article_tags WHERE tag_id = OLD.id)
BEGIN SELECT RAISE(ABORT, 'Rimuovi le associazioni prima di spostare il tag'); END;
--> statement-breakpoint
CREATE TRIGGER cms_category_media_insert BEFORE INSERT ON cms_categories
WHEN NEW.hero_media_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM cms_media WHERE id = NEW.hero_media_id AND deleted_at IS NULL)
BEGIN SELECT RAISE(ABORT, 'Media non disponibile'); END;
--> statement-breakpoint
CREATE TRIGGER cms_tag_active_category_insert BEFORE INSERT ON cms_tags
WHEN NOT EXISTS (SELECT 1 FROM cms_categories WHERE id = NEW.category_id AND deleted_at IS NULL)
BEGIN SELECT RAISE(ABORT, 'Categoria non disponibile'); END;
--> statement-breakpoint
CREATE TRIGGER cms_tag_active_category_update BEFORE UPDATE OF category_id ON cms_tags
WHEN NOT EXISTS (SELECT 1 FROM cms_categories WHERE id = NEW.category_id AND deleted_at IS NULL)
BEGIN SELECT RAISE(ABORT, 'Categoria non disponibile'); END;
--> statement-breakpoint
CREATE TRIGGER cms_article_organization_insert BEFORE INSERT ON cms_articles
WHEN NEW.organization_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM cms_organizations WHERE id = NEW.organization_id AND deleted_at IS NULL)
BEGIN SELECT RAISE(ABORT, 'Organizzazione non disponibile'); END;
--> statement-breakpoint
CREATE TRIGGER cms_article_organization_update BEFORE UPDATE OF organization_id ON cms_articles
WHEN NEW.organization_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM cms_organizations WHERE id = NEW.organization_id AND deleted_at IS NULL)
BEGIN SELECT RAISE(ABORT, 'Organizzazione non disponibile'); END;
