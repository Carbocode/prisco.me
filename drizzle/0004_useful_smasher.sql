CREATE TABLE `cms_article_categories` (
	`article_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`article_id`, `category_id`),
	FOREIGN KEY (`article_id`) REFERENCES `cms_articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `cms_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `cms_article_categories_category_idx` ON `cms_article_categories` (`category_id`,`article_id`);--> statement-breakpoint
CREATE TABLE `cms_article_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`revision` integer NOT NULL,
	`snapshot` text NOT NULL,
	`created_by_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `cms_articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_article_revisions_number_uidx` ON `cms_article_revisions` (`article_id`,`revision`);--> statement-breakpoint
CREATE INDEX `cms_article_revisions_created_idx` ON `cms_article_revisions` (`article_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `cms_articles` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`content_version` integer DEFAULT 1 NOT NULL,
	`cover_media_id` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`author_id` text NOT NULL,
	`last_edited_by_id` text NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`canonical_url` text,
	`no_index` integer DEFAULT false NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`cover_media_id`) REFERENCES `cms_media`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`last_edited_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "cms_articles_status_check" CHECK("cms_articles"."status" IN ('draft','scheduled','published','archived')),
	CONSTRAINT "cms_articles_publish_date_check" CHECK("cms_articles"."status" NOT IN ('published','scheduled') OR "cms_articles"."published_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_articles_slug_uidx` ON `cms_articles` (`slug`);--> statement-breakpoint
CREATE INDEX `cms_articles_status_published_at_idx` ON `cms_articles` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `cms_articles_updated_at_idx` ON `cms_articles` (`updated_at`);--> statement-breakpoint
CREATE INDEX `cms_articles_author_updated_at_idx` ON `cms_articles` (`author_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `cms_articles_deleted_at_idx` ON `cms_articles` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `cms_audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `cms_audit_entity_idx` ON `cms_audit_logs` (`entity_type`,`entity_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `cms_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_categories_name_uidx` ON `cms_categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `cms_categories_slug_uidx` ON `cms_categories` (`slug`);--> statement-breakpoint
CREATE INDEX `cms_categories_deleted_at_idx` ON `cms_categories` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `cms_media` (
	`id` text PRIMARY KEY NOT NULL,
	`storage_key` text NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`width` integer,
	`height` integer,
	`alt_text` text,
	`caption` text,
	`created_by_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "cms_media_size_check" CHECK("cms_media"."size_bytes" >= 0),
	CONSTRAINT "cms_media_width_check" CHECK("cms_media"."width" IS NULL OR "cms_media"."width" > 0),
	CONSTRAINT "cms_media_height_check" CHECK("cms_media"."height" IS NULL OR "cms_media"."height" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_media_storage_key_uidx` ON `cms_media` (`storage_key`);--> statement-breakpoint
CREATE INDEX `cms_media_created_at_idx` ON `cms_media` (`created_at`);--> statement-breakpoint
CREATE INDEX `cms_media_deleted_at_idx` ON `cms_media` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `cms_redirects` (
	`id` text PRIMARY KEY NOT NULL,
	`source_path` text NOT NULL,
	`destination_path` text NOT NULL,
	`status_code` integer DEFAULT 301 NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	CONSTRAINT "cms_redirects_status_check" CHECK("cms_redirects"."status_code" IN (301,302,307,308)),
	CONSTRAINT "cms_redirects_path_check" CHECK("cms_redirects"."source_path" LIKE '/%' AND "cms_redirects"."destination_path" LIKE '/%' AND "cms_redirects"."source_path" != "cms_redirects"."destination_path")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_redirects_source_uidx` ON `cms_redirects` (`source_path`);--> statement-breakpoint
CREATE TABLE `cms_service_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`service_id` text NOT NULL,
	`revision` integer NOT NULL,
	`snapshot` text NOT NULL,
	`created_by_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `cms_services`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_service_revisions_number_uidx` ON `cms_service_revisions` (`service_id`,`revision`);--> statement-breakpoint
CREATE INDEX `cms_service_revisions_created_idx` ON `cms_service_revisions` (`service_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `cms_services` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`short_description` text,
	`content` text NOT NULL,
	`content_version` integer DEFAULT 1 NOT NULL,
	`image_media_id` text,
	`icon` text,
	`price_label` text,
	`call_to_action_label` text,
	`call_to_action_url` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`seo_title` text,
	`seo_description` text,
	`canonical_url` text,
	`no_index` integer DEFAULT false NOT NULL,
	`created_by_id` text NOT NULL,
	`last_edited_by_id` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`image_media_id`) REFERENCES `cms_media`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`last_edited_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "cms_services_status_check" CHECK("cms_services"."status" IN ('draft','published','archived')),
	CONSTRAINT "cms_services_publish_date_check" CHECK("cms_services"."status" != 'published' OR "cms_services"."published_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_services_slug_uidx` ON `cms_services` (`slug`);--> statement-breakpoint
CREATE INDEX `cms_services_status_sort_order_idx` ON `cms_services` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `cms_services_updated_at_idx` ON `cms_services` (`updated_at`);--> statement-breakpoint
CREATE INDEX `cms_services_deleted_at_idx` ON `cms_services` (`deleted_at`);