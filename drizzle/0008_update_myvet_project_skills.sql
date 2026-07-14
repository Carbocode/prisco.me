DELETE FROM `project_skills`
WHERE `project_id` IN ('myvet-user', 'myvet-business');

INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES
  ('myvet-user', 'skill-ionic', 0),
  ('myvet-user', 'skill-capacitor', 1),
  ('myvet-user', 'skill-angular', 2),
  ('myvet-user', 'skill-mapbox', 3),
  ('myvet-user', 'skill-posthog', 4),
  ('myvet-user', 'skill-stripe', 5),
  ('myvet-business', 'skill-ionic', 0),
  ('myvet-business', 'skill-capacitor', 1),
  ('myvet-business', 'skill-angular', 2),
  ('myvet-business', 'skill-posthog', 3),
  ('myvet-business', 'skill-stripe', 4);
