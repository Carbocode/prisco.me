ALTER TABLE `cms_categories` ADD `schema_type` text DEFAULT 'Article' NOT NULL;
--> statement-breakpoint
ALTER TABLE `cms_categories` ADD `archive_sort` text DEFAULT 'published_desc' NOT NULL;
--> statement-breakpoint
ALTER TABLE `cms_categories` ADD `archive_eyebrow` text DEFAULT 'Categoria' NOT NULL;
--> statement-breakpoint
UPDATE `cms_categories`
SET
  `schema_type` = 'CreativeWork',
  `archive_sort` = 'manual',
  `archive_eyebrow` = 'Portfolio'
WHERE `id` = '00000000-0000-4000-8000-000000000501';
