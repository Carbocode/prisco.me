ALTER TABLE `cms_categories` ADD `article_layout` text NOT NULL DEFAULT 'card';
--> statement-breakpoint
UPDATE `cms_categories` SET `article_layout` = 'horizontal' WHERE `slug` = 'blog';
