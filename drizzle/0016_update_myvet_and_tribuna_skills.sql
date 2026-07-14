DELETE FROM `project_skills`
WHERE `project_id` IN ('myvet-services', 'myvet-admin', 'tribuna');

INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES
  ('myvet-services', 'skill-php', 0),
  ('myvet-services', 'skill-symfony', 1),
  ('myvet-services', 'skill-mysql', 2),
  ('myvet-admin', 'skill-tanstack', 0),
  ('myvet-admin', 'skill-react', 1),
  ('myvet-admin', 'skill-prisma-orm', 2),
  ('myvet-admin', 'skill-better-auth', 3),
  ('tribuna', 'skill-tanstack', 0),
  ('tribuna', 'skill-react', 1);

INSERT OR IGNORE INTO `project_skills` (`project_id`, `skill_id`, `sort_order`)
VALUES ('myvet-user', 'skill-elasticsearch', 6);
