INSERT OR IGNORE INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-jwt', 'JWT', 'jsonwebtokens', 'text-pink-200 bg-pink-300/15 border-pink-300/25', 'JWT', 'key-24', 1, 41);
INSERT OR IGNORE INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-better-auth', 'Better Auth', 'betterauth', 'text-slate-100 bg-white/10 border-white/20', 'BA', 'shield-lock-24', 4, 42);

INSERT OR IGNORE INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES
  ('itt-diploma', 'skill-jwt', 4),
  ('myvet-developer', 'skill-jwt', 3),
  ('myvet-engineer', 'skill-better-auth', 8);
