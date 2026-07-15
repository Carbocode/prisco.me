CREATE TABLE `cms_article_tags` (
	`article_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`article_id`, `tag_id`),
	FOREIGN KEY (`article_id`) REFERENCES `cms_articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `cms_tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `cms_article_tags_tag_idx` ON `cms_article_tags` (`tag_id`,`article_id`);--> statement-breakpoint
CREATE TABLE `cms_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`icon` text,
	`color` text DEFAULT '#64748b' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	CONSTRAINT "cms_tags_color_check" CHECK("cms_tags"."color" GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_tags_name_uidx` ON `cms_tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `cms_tags_slug_uidx` ON `cms_tags` (`slug`);--> statement-breakpoint
CREATE INDEX `cms_tags_deleted_at_idx` ON `cms_tags` (`deleted_at`);