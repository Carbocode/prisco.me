DELETE FROM `experience_projects` WHERE `experience_id` = 'myvet-engineer' AND `project_id` = 'swiftui';

INSERT OR IGNORE INTO `experience_projects` (`experience_id`, `project_id`, `sort_order`) VALUES
  ('unibo-degree', 'swiftui', 0),
  ('myvet-engineer', 'myvet-user', 0);

INSERT OR IGNORE INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-engineer', 'skill-elasticsearch', 9);
