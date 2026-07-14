INSERT OR IGNORE INTO `projects` (`id`, `slug`, `title`, `summary`, `description`, `role`, `company`, `category`, `period`, `featured`, `sort_order`) VALUES ('myvet-admin', 'myvet-admin', 'MyVet Admin', 'Il pannello amministrativo dell''ecosistema MyVet.', 'Un''applicazione interna per gestire utenti, professionisti, contenuti e operazioni trasversali dell''ecosistema MyVet.', 'Software Engineer', 'MyVet', 'web', 'Aprile 2024 - Settembre 2025', 0, 6);
INSERT OR IGNORE INTO `projects` (`id`, `slug`, `title`, `summary`, `description`, `role`, `company`, `category`, `period`, `featured`, `sort_order`) VALUES ('myvet-services', 'myvet-services', 'MyVet Services', 'I servizi backend condivisi dell''ecosistema MyVet.', 'API e servizi applicativi che collegano i prodotti MyVet e centralizzano logica di dominio, dati e integrazioni.', 'Software Engineer', 'MyVet', 'backend', 'Aprile 2024 - Settembre 2025', 0, 7);

INSERT OR IGNORE INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-admin-section-0', 'myvet-admin', 'Obiettivo', 'MyVet Admin riunisce in un unico pannello gli strumenti necessari per amministrare i prodotti e i dati dell''ecosistema MyVet.', NULL, 0);
INSERT OR IGNORE INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-services-section-0', 'myvet-services', 'Architettura', 'MyVet Services concentra le funzionalita backend condivise dai prodotti dell''ecosistema, mantenendo coerenti dominio e integrazioni.', NULL, 0);

INSERT OR IGNORE INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES
  ('myvet-admin', 'skill-angular', 0),
  ('myvet-admin', 'skill-net-c', 1),
  ('myvet-admin', 'skill-prisma-orm', 2),
  ('myvet-services', 'skill-net-c', 0),
  ('myvet-services', 'skill-prisma-orm', 1);

INSERT OR IGNORE INTO `experience_projects` (`experience_id`, `project_id`, `sort_order`) VALUES
  ('myvet-engineer', 'myvet-admin', 2),
  ('myvet-engineer', 'myvet-services', 3);

DELETE FROM `project_categories`
WHERE `project_id` IN ('myvet-user', 'myvet-business', 'egaf-ui', 'tribuna', 'swiftui', 'myvet-diet', 'myvet-admin', 'myvet-services');

INSERT INTO `project_categories` (`project_id`, `category`, `sort_order`) VALUES
  ('myvet-user', 'web', 0), ('myvet-user', 'mobile', 1),
  ('myvet-business', 'web', 0), ('myvet-business', 'mobile', 1),
  ('egaf-ui', 'web', 0),
  ('tribuna', 'web', 0),
  ('swiftui', 'mobile', 0),
  ('myvet-diet', 'web', 0), ('myvet-diet', 'backend', 1),
  ('myvet-admin', 'web', 0), ('myvet-admin', 'backend', 1),
  ('myvet-services', 'backend', 0);
