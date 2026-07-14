DELETE FROM `experience_skills`
WHERE `experience_id` = 'unibo-degree'
  AND `skill_id` IN (
    'skill-python',
    'skill-java',
    'skill-mvvm',
    'skill-swift-swiftui'
  );

INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES
  ('unibo-degree', 'skill-java', 2),
  ('unibo-degree', 'skill-mvvm', 3),
  ('unibo-degree', 'skill-swift-swiftui', 4);
