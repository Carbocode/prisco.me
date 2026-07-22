-- I progetti sono articoli CMS appartenenti alla categoria `progetti`.
-- Prima di eliminare il portfolio legacy, conserva i collegamenti con le esperienze.
CREATE TABLE `experience_projects_new` (
	`experience_id` text NOT NULL,
	`article_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`experience_id`, `article_id`),
	FOREIGN KEY (`experience_id`) REFERENCES `experiences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`article_id`) REFERENCES `cms_articles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `experience_projects_new` (`experience_id`, `article_id`, `sort_order`)
SELECT link.experience_id, article.id, link.sort_order
FROM `experience_projects` link
JOIN `cms_articles` article ON article.legacy_project_id = link.project_id;
--> statement-breakpoint
DROP TABLE `experience_projects`;
--> statement-breakpoint
ALTER TABLE `experience_projects_new` RENAME TO `experience_projects`;
--> statement-breakpoint
DROP TABLE `project_categories`;
--> statement-breakpoint
DROP TABLE `project_skills`;
--> statement-breakpoint
DROP TABLE `project_sections`;
--> statement-breakpoint
DROP TABLE `projects`;
--> statement-breakpoint
DROP INDEX `cms_articles_legacy_project_uidx`;
--> statement-breakpoint
ALTER TABLE `cms_articles` DROP COLUMN `legacy_project_id`;
--> statement-breakpoint
PRAGMA optimize;
