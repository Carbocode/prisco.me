INSERT OR IGNORE INTO `projects` (`id`, `slug`, `title`, `summary`, `description`, `role`, `company`, `category`, `period`, `featured`, `sort_order`) VALUES ('violazioni-cds', 'violazioni-cds', 'Violazioni CDS', 'Un''applicazione dedicata alla gestione delle violazioni del Codice della Strada.', 'Un prodotto per consultare e gestire in modo strutturato le violazioni del Codice della Strada.', 'Software Engineer', 'EGAF', 'web', NULL, 0, 8);

INSERT OR IGNORE INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('violazioni-cds-section-0', 'violazioni-cds', 'Obiettivo', 'Violazioni CDS organizza in un''unica applicazione le informazioni e i flussi legati alle violazioni del Codice della Strada.', NULL, 0);

INSERT OR IGNORE INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES
  ('violazioni-cds', 'skill-angular', 0),
  ('violazioni-cds', 'skill-capacitor', 1);

INSERT OR IGNORE INTO `project_categories` (`project_id`, `category`, `sort_order`) VALUES
  ('violazioni-cds', 'web', 0),
  ('violazioni-cds', 'mobile', 1);

INSERT OR IGNORE INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES
  ('egaf-engineer', 'skill-angular', 8),
  ('egaf-engineer', 'skill-capacitor', 9);

INSERT OR IGNORE INTO `experience_projects` (`experience_id`, `project_id`, `sort_order`) VALUES ('egaf-engineer', 'violazioni-cds', 2);
