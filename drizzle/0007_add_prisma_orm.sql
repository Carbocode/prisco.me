INSERT OR IGNORE INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`)
VALUES ('skill-prisma-orm', 'Prisma ORM', 'prisma', 'text-slate-100 bg-white/10 border-white/20', 'PR', 'database-24', 1, 40);

INSERT OR IGNORE INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`)
VALUES ('myvet-engineer', 'skill-prisma-orm', 7);
