ALTER TABLE `cms_media` ADD `name` text;
--> statement-breakpoint
UPDATE `cms_media` SET `name` = `filename` WHERE `name` IS NULL;
