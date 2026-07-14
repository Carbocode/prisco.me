DELETE FROM `experience_skills`
WHERE `experience_id` = 'tinfo-intern';

INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`)
VALUES ('tinfo-intern', 'skill-web-development', 0);
