UPDATE `skills`
SET `name` = 'TanStack Start'
WHERE `id` = 'skill-tanstack';

DELETE FROM `experience_skills`
WHERE `experience_id` = 'egaf-engineer';

INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES
  ('egaf-engineer', 'skill-net-c', 0),
  ('egaf-engineer', 'skill-tanstack', 1),
  ('egaf-engineer', 'skill-react', 2),
  ('egaf-engineer', 'skill-lit', 3),
  ('egaf-engineer', 'skill-web-components', 4),
  ('egaf-engineer', 'skill-typescript', 5),
  ('egaf-engineer', 'skill-storybook', 6),
  ('egaf-engineer', 'skill-wcag', 7);
