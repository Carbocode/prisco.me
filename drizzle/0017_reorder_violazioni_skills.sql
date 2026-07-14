DELETE FROM `project_skills`
WHERE `project_id` = 'violazioni-cds';

INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES
  ('violazioni-cds', 'skill-capacitor', 0),
  ('violazioni-cds', 'skill-angular', 1);
