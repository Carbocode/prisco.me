-- Converge il portfolio legacy nel CMS.
-- La migration e idempotente rispetto ai dati importati grazie alle chiavi
-- legacy_project_id / legacy_skill_id e conserva integralmente le tabelle
-- portfolio, ancora usate dallo storico delle esperienze.

CREATE TABLE `cms_organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`website_url` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	CONSTRAINT "cms_organizations_type_check" CHECK(`type` IN ('company','university'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_organizations_name_uidx` ON `cms_organizations` (`name`);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_organizations_slug_uidx` ON `cms_organizations` (`slug`);
--> statement-breakpoint
CREATE INDEX `cms_organizations_type_name_idx` ON `cms_organizations` (`type`,`name`);
--> statement-breakpoint
CREATE INDEX `cms_organizations_deleted_at_idx` ON `cms_organizations` (`deleted_at`);
--> statement-breakpoint

ALTER TABLE `cms_articles` ADD `organization_id` text REFERENCES `cms_organizations`(`id`);
--> statement-breakpoint
ALTER TABLE `cms_articles` ADD `project_role` text;
--> statement-breakpoint
ALTER TABLE `cms_articles` ADD `project_period` text;
--> statement-breakpoint
ALTER TABLE `cms_articles` ADD `project_featured` integer DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE `cms_articles` ADD `project_sort_order` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `cms_articles` ADD `legacy_project_id` text;
--> statement-breakpoint
CREATE INDEX `cms_articles_organization_idx` ON `cms_articles` (`organization_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_articles_legacy_project_uidx` ON `cms_articles` (`legacy_project_id`);
--> statement-breakpoint

INSERT OR IGNORE INTO `cms_categories`
  (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`)
VALUES
  ('00000000-0000-4000-8000-000000000501', 'Progetti', 'progetti',
   'Progetti del portfolio personale.', unixepoch() * 1000, unixepoch() * 1000);
--> statement-breakpoint

PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `__new_cms_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category_id` text NOT NULL,
	`icon` text,
	`color` text DEFAULT 'text-slate-200 bg-white/10 border-white/15' NOT NULL,
	`mark` text,
	`fluent_icon` text,
	`legacy_skill_id` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `cms_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_cms_tags`
  (`id`,`name`,`slug`,`category_id`,`icon`,`color`,`created_at`,`updated_at`,`deleted_at`)
SELECT `id`,`name`,`slug`,'00000000-0000-4000-8000-000000000501',`icon`,coalesce(`color`, 'text-slate-200 bg-white/10 border-white/15'),`created_at`,`updated_at`,`deleted_at`
FROM `cms_tags`;
--> statement-breakpoint
DROP TABLE `cms_tags`;
--> statement-breakpoint
ALTER TABLE `__new_cms_tags` RENAME TO `cms_tags`;
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_tags_name_uidx` ON `cms_tags` (`name`);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_tags_slug_uidx` ON `cms_tags` (`slug`);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_tags_legacy_skill_uidx` ON `cms_tags` (`legacy_skill_id`);
--> statement-breakpoint
CREATE INDEX `cms_tags_category_name_idx` ON `cms_tags` (`category_id`,`name`);
--> statement-breakpoint
CREATE INDEX `cms_tags_deleted_at_idx` ON `cms_tags` (`deleted_at`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
--> statement-breakpoint

INSERT OR IGNORE INTO `cms_organizations`
  (`id`,`name`,`slug`,`type`,`created_at`,`updated_at`)
SELECT
  lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-a' || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
  source.name,
  lower(replace(replace(replace(source.name, ' ', '-'), '.', ''), '''', '')),
  source.type,
  unixepoch() * 1000,
  unixepoch() * 1000
FROM (
  SELECT DISTINCT company AS name, 'company' AS type FROM projects
  UNION
  SELECT DISTINCT org AS name, 'university' AS type
  FROM experiences
  WHERE kind = 'education'
) source
WHERE trim(source.name) <> '';
--> statement-breakpoint

INSERT OR IGNORE INTO `cms_tags`
  (`id`,`name`,`slug`,`category_id`,`icon`,`color`,`mark`,`fluent_icon`,`legacy_skill_id`,`created_at`,`updated_at`)
SELECT
  lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-a' || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
  skills.name,
  lower(replace(replace(replace(replace(skills.name, ' / ', '-'), '.', ''), ' ', '-'), '#', 'sharp')),
  '00000000-0000-4000-8000-000000000501',
  skills.icon,
  coalesce(skills.color, 'text-slate-200 bg-white/10 border-white/15'),
  skills.mark,
  skills.fluent_icon,
  skills.id,
  unixepoch() * 1000,
  unixepoch() * 1000
FROM skills;
--> statement-breakpoint

-- Se un tag CMS con lo stesso nome esisteva gia, lo collega alla skill legacy
-- e ne adotta iconografia e colore senza duplicarlo.
UPDATE `cms_tags`
SET
  `category_id` = '00000000-0000-4000-8000-000000000501',
  `legacy_skill_id` = (SELECT s.id FROM skills s WHERE s.name = cms_tags.name),
  `icon` = coalesce((SELECT s.icon FROM skills s WHERE s.name = cms_tags.name), cms_tags.icon),
  `color` = coalesce((SELECT s.color FROM skills s WHERE s.name = cms_tags.name), cms_tags.color),
  `mark` = coalesce((SELECT s.mark FROM skills s WHERE s.name = cms_tags.name), cms_tags.mark),
  `fluent_icon` = coalesce((SELECT s.fluent_icon FROM skills s WHERE s.name = cms_tags.name), cms_tags.fluent_icon)
WHERE EXISTS (SELECT 1 FROM skills s WHERE s.name = cms_tags.name);
--> statement-breakpoint

-- Trasforma ogni sezione del progetto nel documento JSON usato dall'editor CMS.
INSERT OR IGNORE INTO `cms_articles`
  (`id`,`title`,`slug`,`excerpt`,`content`,`status`,`published_at`,`author_id`,`last_edited_by_id`,
   `organization_id`,`project_role`,`project_period`,`project_featured`,`project_sort_order`,
   `legacy_project_id`,`seo_description`,`created_at`,`updated_at`)
SELECT
  lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-a' || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
  p.title,
  p.slug,
  p.summary,
  '{"type":"doc","content":[' ||
  coalesce((
    SELECT group_concat(section_nodes, ',')
    FROM (
      SELECT
        json_object(
          'type','heading',
          'attrs',json_object('level',2),
          'content',json_array(json_object('type','text','text',ps.title))
        ) || ',' ||
        json_object(
          'type','paragraph',
          'content',json_array(json_object('type','text','text',ps.body))
        ) ||
        CASE WHEN ps.bullets IS NOT NULL AND json_valid(ps.bullets) THEN
          ',' || json_object(
            'type','bulletList',
            'content',json((
              SELECT json_group_array(
                json_object(
                  'type','listItem',
                  'content',json_array(
                    json_object(
                      'type','paragraph',
                      'content',json_array(json_object('type','text','text',bullet.value))
                    )
                  )
                )
              )
              FROM json_each(ps.bullets) bullet
            ))
          )
        ELSE '' END AS section_nodes
      FROM project_sections ps
      WHERE ps.project_id = p.id
      ORDER BY ps.sort_order
    )
  ), json_object(
    'type','paragraph',
    'content',json_array(json_object('type','text','text',p.description))
  )) || ']}',
  'published',
  unixepoch() * 1000,
  author.id,
  author.id,
  organization.id,
  p.role,
  p.period,
  p.featured,
  p.sort_order,
  p.id,
  p.description,
  unixepoch() * 1000,
  unixepoch() * 1000
FROM projects p
JOIN (SELECT id FROM user ORDER BY CASE role WHEN 'admin' THEN 0 WHEN 'editor' THEN 1 ELSE 2 END, created_at LIMIT 1) author
LEFT JOIN cms_organizations organization ON organization.name = p.company;
--> statement-breakpoint

INSERT OR IGNORE INTO `cms_article_categories` (`article_id`,`category_id`)
SELECT article.id, '00000000-0000-4000-8000-000000000501'
FROM cms_articles article
WHERE article.legacy_project_id IS NOT NULL;
--> statement-breakpoint

INSERT OR IGNORE INTO `cms_article_tags` (`article_id`,`tag_id`)
SELECT article.id, tag.id
FROM project_skills project_skill
JOIN cms_articles article ON article.legacy_project_id = project_skill.project_id
JOIN cms_tags tag ON tag.legacy_skill_id = project_skill.skill_id;
--> statement-breakpoint

DROP TABLE IF EXISTS `cms_service_revisions`;
--> statement-breakpoint
DROP TABLE IF EXISTS `cms_services`;
--> statement-breakpoint
PRAGMA optimize;
