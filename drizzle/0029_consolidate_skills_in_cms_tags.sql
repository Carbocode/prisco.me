-- Le skill sono tag CMS associati agli articoli della categoria `progetti`.
-- Conserva la configurazione presentazionale del marquee prima di eliminare
-- le tabelle legacy.
ALTER TABLE `cms_tags` ADD `marquee_row` integer;
--> statement-breakpoint
UPDATE `cms_tags`
SET `marquee_row` = (
  SELECT legacy_skill.marquee_row
  FROM `skills` legacy_skill
  WHERE legacy_skill.id = cms_tags.legacy_skill_id
)
WHERE `legacy_skill_id` IS NOT NULL;
--> statement-breakpoint
DROP TABLE `experience_skills`;
--> statement-breakpoint
DROP TABLE `skills`;
--> statement-breakpoint
PRAGMA optimize;
