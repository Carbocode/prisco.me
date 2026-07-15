-- Introduce il tipo generale `education` senza ricostruire la tabella, che è
-- già referenziata dagli articoli. La colonna legacy `type` resta soltanto per
-- compatibilità con la 0018 e non viene più letta dall'applicazione.
ALTER TABLE `cms_organizations`
ADD `organization_type` text NOT NULL DEFAULT 'company'
CHECK(`organization_type` IN ('company','education'));
--> statement-breakpoint
UPDATE `cms_organizations`
SET `organization_type` = CASE
  WHEN `type` = 'university' THEN 'education'
  ELSE `type`
END;
--> statement-breakpoint
DROP INDEX `cms_organizations_type_name_idx`;
--> statement-breakpoint
CREATE INDEX `cms_organizations_type_name_idx`
ON `cms_organizations` (`organization_type`,`name`);
--> statement-breakpoint
PRAGMA optimize;
