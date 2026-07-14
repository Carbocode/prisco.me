-- Seed dati portfolio: skill, progetti, esperienze e collegamenti.
-- Generato una tantum per migrare i dati statici sul database.

DELETE FROM `experience_projects`;
DELETE FROM `experience_skills`;
DELETE FROM `project_skills`;
DELETE FROM `project_sections`;
DELETE FROM `experiences`;
DELETE FROM `projects`;
DELETE FROM `skills`;

INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-net-c', '.NET / C#', 'dotnet', 'text-violet-200 bg-violet-300/15 border-violet-300/25', '.N', 'code-24', 1, 0);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-java', 'Java', NULL, 'text-orange-200 bg-orange-300/15 border-orange-300/25', 'J', 'code-24', 1, 1);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-python', 'Python', 'python', 'text-yellow-200 bg-yellow-300/15 border-yellow-300/25', 'Py', 'code-24', 1, 2);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-php', 'PHP', 'php', 'text-indigo-200 bg-indigo-300/15 border-indigo-300/25', 'PHP', 'code-24', 1, 3);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-symfony', 'Symfony', 'symfony', 'text-slate-100 bg-white/10 border-white/20', 'Sf', 'code-24', 1, 4);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-mysql', 'MySQL', 'mysql', 'text-blue-200 bg-blue-300/15 border-blue-300/25', 'MY', 'database-24', 1, 5);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-postgresql', 'PostgreSQL', 'postgresql', 'text-sky-200 bg-sky-300/15 border-sky-300/25', 'PG', 'database-24', 1, 6);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-mongodb', 'MongoDB', 'mongodb', 'text-green-200 bg-green-300/15 border-green-300/25', 'DB', 'database-24', 1, 7);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-elasticsearch', 'Elasticsearch', 'elasticsearch', 'text-yellow-200 bg-yellow-300/15 border-yellow-300/25', 'ES', 'data-area-24', 1, 8);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-angular', 'Angular', 'angular', 'text-red-200 bg-red-300/15 border-red-300/25', 'A', 'code-24', 2, 9);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-react', 'React', 'react', 'text-cyan-200 bg-cyan-300/15 border-cyan-300/25', 'R', 'code-24', 2, 10);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-next-js', 'Next.js', 'nextdotjs', 'text-slate-100 bg-white/10 border-white/20', 'N', 'code-24', 2, 11);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-astro', 'Astro', 'astro', 'text-orange-200 bg-orange-300/15 border-orange-300/25', '✦', 'design-ideas-24', 2, 12);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-tanstack', 'TanStack', 'tanstack', 'text-red-200 bg-red-300/15 border-red-300/25', 'TS', 'code-block-24', 2, 13);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-typescript', 'TypeScript', 'typescript', 'text-blue-200 bg-blue-300/15 border-blue-300/25', 'TS', 'code-24', 2, 14);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-tailwind-css', 'Tailwind CSS', 'tailwindcss', 'text-cyan-200 bg-cyan-300/15 border-cyan-300/25', 'TW', 'code-24', 2, 15);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-swift-swiftui', 'Swift / SwiftUI', 'swift', 'text-orange-200 bg-orange-300/15 border-orange-300/25', 'SW', 'phone-24', 3, 16);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-react-native', 'React Native', 'react', 'text-cyan-200 bg-cyan-300/15 border-cyan-300/25', 'RN', 'phone-24', 3, 17);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-mvvm', 'MVVM', NULL, 'text-cyan-200 bg-cyan-300/15 border-cyan-300/25', 'M', 'apps-list-24', 3, 18);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-ionic', 'Ionic', 'ionic', 'text-blue-200 bg-blue-300/15 border-blue-300/25', 'I', 'layer-diagonal-person-24', 3, 19);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-capacitor', 'Capacitor', 'capacitor', 'text-sky-200 bg-sky-300/15 border-sky-300/25', 'C', 'phone-24', 3, 20);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-mapbox', 'Mapbox', 'mapbox', 'text-emerald-200 bg-emerald-300/15 border-emerald-300/25', 'M', 'globe-24', 3, 21);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-stripe', 'Stripe', 'stripe', 'text-indigo-200 bg-indigo-300/15 border-indigo-300/25', 'S', 'apps-24', 3, 22);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-cloudflare', 'Cloudflare', 'cloudflare', 'text-amber-200 bg-amber-300/15 border-amber-300/25', 'CF', 'cloud-24', 4, 23);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-posthog', 'PostHog', 'posthog', 'text-fuchsia-200 bg-fuchsia-300/15 border-fuchsia-300/25', 'PH', 'data-trending-24', 4, 24);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-strapi', 'Strapi', 'strapi', 'text-indigo-200 bg-indigo-300/15 border-indigo-300/25', 'S', 'database-24', 4, 25);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-sentry', 'Sentry', 'sentry', 'text-violet-200 bg-violet-300/15 border-violet-300/25', 'S', 'bug-24', 4, 26);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-figma', 'Figma', 'figma', 'text-pink-200 bg-pink-300/15 border-pink-300/25', 'F', 'design-ideas-24', 4, 27);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-uml', 'UML', 'uml', 'text-lime-200 bg-lime-300/15 border-lime-300/25', 'U', 'apps-list-24', 4, 28);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-software-architecture', 'Software Architecture', NULL, 'text-sky-200 bg-sky-300/15 border-sky-300/25', 'SA', 'layer-diagonal-person-24', 4, 29);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-product-design', 'Product Design', NULL, 'text-pink-200 bg-pink-300/15 border-pink-300/25', 'PD', 'design-ideas-24', 4, 30);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-storybook', 'Storybook', 'storybook', 'text-pink-200 bg-pink-300/15 border-pink-300/25', 'SB', 'apps-list-24', 4, 31);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-codex', 'Codex', 'openai', 'text-emerald-200 bg-emerald-300/15 border-emerald-300/25', 'CX', 'code-24', 4, 32);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-claude-code', 'Claude Code', 'claude', 'text-orange-200 bg-orange-300/15 border-orange-300/25', 'CC', 'code-24', 4, 33);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-lit', 'Lit', NULL, 'text-slate-200 bg-white/10 border-white/15', 'Li', 'code-24', NULL, 34);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-web-components', 'Web Components', NULL, 'text-slate-200 bg-white/10 border-white/15', 'WC', 'code-24', NULL, 35);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-wcag', 'WCAG', NULL, 'text-slate-200 bg-white/10 border-white/15', 'WA', 'apps-list-24', NULL, 36);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-web', 'Web', NULL, 'text-blue-200 bg-blue-300/15 border-blue-300/25', 'W', 'globe-24', NULL, 37);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-web-development', 'Web Development', NULL, 'text-blue-200 bg-blue-300/15 border-blue-300/25', 'W', 'globe-24', NULL, 38);
INSERT INTO `skills` (`id`, `name`, `icon`, `color`, `mark`, `fluent_icon`, `marquee_row`, `sort_order`) VALUES ('skill-vite', 'Vite', 'vite', 'text-purple-200 bg-purple-300/15 border-purple-300/25', 'V', 'code-24', NULL, 39);

INSERT INTO `projects` (`id`, `slug`, `title`, `summary`, `description`, `role`, `company`, `category`, `period`, `featured`, `sort_order`) VALUES ('myvet-user', 'myvet-user', 'MyVet User', 'L''app pensata per i proprietari di animali domestici.', 'L''applicazione con cui i proprietari trovano professionisti, prenotano appuntamenti e conservano la storia clinica del proprio animale.', 'Software Developer / Software Engineer', 'MyVet', 'web', 'Aprile 2023 - Settembre 2025', 1, 0);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-user-section-0', 'myvet-user', 'Il problema', 'MyVet nasce per rendere piu semplice la relazione tra proprietari di animali e professionisti della pet care, raccogliendo in un unico posto ricerca, prenotazioni e informazioni sanitarie.', NULL, 0);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-user-section-1', 'myvet-user', 'Il prodotto', 'MyVet User aiuta i proprietari a trovare professionisti, prenotare appuntamenti e conservare la storia clinica dell''animale in un unico posto.', '["Ricerca dei professionisti e prenotazione degli appuntamenti","Cartella digitale con terapie, vaccini, referti e visite"]', 1);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-user-section-2', 'myvet-user', 'Il mio contributo', 'Ho partecipato all''evoluzione del prodotto dall''ideazione alla pubblicazione, lavorando su sviluppo web e mobile, architettura, problem solving e qualita del prodotto.', NULL, 2);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-user-section-3', 'myvet-user', 'Cosa mi ha insegnato', 'Lavorare su un prodotto reale mi ha insegnato a tenere insieme esigenze degli utenti, vincoli tecnici e sostenibilita delle decisioni nel tempo.', NULL, 3);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-user', 'skill-ionic', 0);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-user', 'skill-capacitor', 1);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-user', 'skill-angular', 2);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-user', 'skill-mapbox', 3);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-user', 'skill-cloudflare', 4);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-user', 'skill-posthog', 5);

INSERT INTO `projects` (`id`, `slug`, `title`, `summary`, `description`, `role`, `company`, `category`, `period`, `featured`, `sort_order`) VALUES ('myvet-business', 'myvet-business', 'MyVet Business', 'Il gestionale per i professionisti della pet care.', 'Il gestionale aperto con cui veterinari, toelettatori ed educatori cinofili organizzano clienti, appuntamenti e strumenti personalizzati.', 'Software Developer / Software Engineer', 'MyVet', 'web', 'Aprile 2023 - Settembre 2025', 1, 1);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-business-section-0', 'myvet-business', 'Il problema', 'MyVet nasce per rendere piu semplice la relazione tra proprietari di animali e professionisti della pet care, raccogliendo in un unico posto ricerca, prenotazioni e informazioni sanitarie.', NULL, 0);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-business-section-1', 'myvet-business', 'Il prodotto', 'MyVet Business offre ai professionisti un gestionale aperto per clienti, appuntamenti e strumenti personalizzati.', '["Gestione di clienti registrati e non registrati","Calendario degli appuntamenti","Notifiche automatiche tramite WhatsApp","Strumenti dedicati a veterinari, toelettatori ed educatori cinofili"]', 1);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-business-section-2', 'myvet-business', 'Il mio contributo', 'Ho partecipato all''evoluzione del prodotto dall''ideazione alla pubblicazione, lavorando su sviluppo web e mobile, architettura, problem solving e qualita del prodotto.', NULL, 2);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-business-section-3', 'myvet-business', 'Cosa mi ha insegnato', 'Lavorare su un prodotto reale mi ha insegnato a tenere insieme esigenze degli utenti, vincoli tecnici e sostenibilita delle decisioni nel tempo.', NULL, 3);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-business', 'skill-ionic', 0);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-business', 'skill-capacitor', 1);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-business', 'skill-angular', 2);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-business', 'skill-mapbox', 3);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-business', 'skill-cloudflare', 4);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-business', 'skill-posthog', 5);

INSERT INTO `projects` (`id`, `slug`, `title`, `summary`, `description`, `role`, `company`, `category`, `period`, `featured`, `sort_order`) VALUES ('egaf-ui', 'egaf-ui', 'EGAF UI', 'Una libreria di web component nativi costruita con Lit.', 'Una libreria di componenti UI costruita con Lit per creare web component nativi, riutilizzabili in tutti i principali framework, testati per funzionamento, rendering e accessibilita WCAG tramite Storybook e corredati di documentazione per gli sviluppatori.', 'Software Engineer', 'EGAF', 'web', NULL, 1, 2);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('egaf-ui-section-0', 'egaf-ui', 'Obiettivo', 'EGAF UI nasce per offrire una libreria di componenti condivisi, costruiti come web component nativi in JavaScript e quindi utilizzabili in tutti i principali framework senza vincoli di stack.', NULL, 0);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('egaf-ui-section-1', 'egaf-ui', 'Il prodotto', 'La libreria e stata realizzata con il framework Lit, con attenzione alla riusabilita, alla coerenza dei componenti e alla loro integrazione trasversale.', '["Web component nativi utilizzabili in tutti i principali framework","Test di funzionamento, rendering e accessibilita WCAG tramite Storybook","Documentazione dedicata agli sviluppatori"]', 1);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('egaf-ui-section-2', 'egaf-ui', 'Cosa mi ha insegnato', 'Costruire una libreria condivisa mi ha insegnato a progettare componenti pensando alla riusabilita, all''accessibilita e all''esperienza di chi li integra.', NULL, 2);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('egaf-ui', 'skill-lit', 0);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('egaf-ui', 'skill-web-components', 1);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('egaf-ui', 'skill-typescript', 2);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('egaf-ui', 'skill-storybook', 3);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('egaf-ui', 'skill-wcag', 4);

INSERT INTO `projects` (`id`, `slug`, `title`, `summary`, `description`, `role`, `company`, `category`, `period`, `featured`, `sort_order`) VALUES ('tribuna', 'tribuna', 'Tribuna', 'Una piattaforma per esplorare i maggiori dataset legali.', 'Una piattaforma per esplorare i maggiori dataset legali, scoprire le novita in ambito giuridico e gestire il dataset interno di articoli e norme.', 'Software Engineer', 'EGAF', 'web', NULL, 0, 3);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('tribuna-section-0', 'tribuna', 'Obiettivo', 'Tribuna nasce per rendere accessibile l''esplorazione dei maggiori dataset legali, aiutando gli utenti a scoprire le novita in ambito giuridico e a gestire il dataset interno di articoli e norme in modo semplice e strutturato.', '["Esplorazione dei maggiori dataset legali","Scoperta delle novita in ambito giuridico","Gestione del dataset interno di articoli e norme"]', 0);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('tribuna-section-1', 'tribuna', 'Cosa mi ha insegnato', 'Lavorare con grandi dataset legali mi ha insegnato l''importanza di organizzare e presentare le informazioni in modo chiaro, mantenendo attenzione alle esigenze di chi le consulta.', NULL, 1);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('tribuna', 'skill-typescript', 0);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('tribuna', 'skill-web', 1);

INSERT INTO `projects` (`id`, `slug`, `title`, `summary`, `description`, `role`, `company`, `category`, `period`, `featured`, `sort_order`) VALUES ('swiftui', 'swiftui', 'App nativa in SwiftUI', 'La trasposizione nativa dell''app MyVet in SwiftUI.', 'Un progetto per esplorare una nuova implementazione nativa, mantenendo il dominio e l''esperienza del prodotto originale.', 'Software Engineer', 'MyVet', 'mobile', 'Dicembre 2024 - Settembre 2025', 0, 4);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('swiftui-section-0', 'swiftui', 'Perche una versione nativa', 'La versione nativa e stata un''occasione per valutare approcci diversi rispetto all''applicazione ibrida e approfondire le possibilita offerte da SwiftUI.', NULL, 0);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('swiftui-section-1', 'swiftui', 'Architettura', 'Il progetto e stato organizzato seguendo un approccio MVVM, con attenzione alla separazione delle responsabilita e alla leggibilita del codice.', NULL, 1);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('swiftui-section-2', 'swiftui', 'Cosa mi ha insegnato', 'Il confronto tra implementazione ibrida e nativa ha reso piu chiare le conseguenze delle scelte architetturali sul prodotto e sul lavoro quotidiano.', NULL, 2);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('swiftui', 'skill-swift-swiftui', 0);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('swiftui', 'skill-mvvm', 1);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('swiftui', 'skill-software-architecture', 2);

INSERT INTO `projects` (`id`, `slug`, `title`, `summary`, `description`, `role`, `company`, `category`, `period`, `featured`, `sort_order`) VALUES ('myvet-diet', 'myvet-diet', 'MyVet Diet', 'Un progetto verticale dell''ecosistema MyVet dedicato alla gestione delle diete.', 'Un''esperienza di prodotto che unisce modellazione, pagamenti e attenzione al dominio della pet care.', 'Software Engineer', 'MyVet', 'backend', 'Maggio 2025 - Settembre 2025', 0, 5);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-diet-section-0', 'myvet-diet', 'Obiettivo', 'MyVet Diet nasce come progetto verticale collegato all''ecosistema MyVet, con un focus specifico sulla gestione delle diete e dei relativi servizi.', NULL, 0);
INSERT INTO `project_sections` (`id`, `project_id`, `title`, `body`, `bullets`, `sort_order`) VALUES ('myvet-diet-section-1', 'myvet-diet', 'Decisioni di prodotto', 'La modellazione UML ha aiutato a chiarire il dominio, mentre l''integrazione con Stripe ha richiesto attenzione al flusso di acquisto e alla sua affidabilita.', NULL, 1);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-diet', 'skill-stripe', 0);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-diet', 'skill-uml', 1);
INSERT INTO `project_skills` (`project_id`, `skill_id`, `sort_order`) VALUES ('myvet-diet', 'skill-product-design', 2);

INSERT INTO `experiences` (`id`, `kind`, `org`, `org_detail`, `title`, `detail`, `period`, `narrative`, `start_date`, `end_date`, `current`, `sort_order`) VALUES ('tinfo-intern', 'work', 'T-Info', 'Alternanza scuola-lavoro', 'Alternanza scuola-lavoro', 'Alternanza scuola-lavoro da T-Info', 'mag - lug 2021', 'Il primo contatto con un ambiente di lavoro reale durante la scuola: vedere da vicino come si porta avanti un progetto software fuori dall''aula.', '2021-05', '2021-08', 0, 0);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('tinfo-intern', 'skill-php', 0);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('tinfo-intern', 'skill-mysql', 1);

INSERT INTO `experiences` (`id`, `kind`, `org`, `org_detail`, `title`, `detail`, `period`, `narrative`, `start_date`, `end_date`, `current`, `sort_order`) VALUES ('myvet-developer', 'work', 'MyVet', '2 ruoli nella stessa azienda', 'Developer', 'Software Developer', 'apr 2023 - apr 2024', 'Entro in MyVet come Software Developer. Metto mano al prodotto vero, imparo a lavorare in team e a portare il codice fino in produzione.', '2023-04', '2024-04', 0, 1);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-developer', 'skill-ionic', 0);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-developer', 'skill-capacitor', 1);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-developer', 'skill-angular', 2);
INSERT INTO `experience_projects` (`experience_id`, `project_id`, `sort_order`) VALUES ('myvet-developer', 'myvet-user', 0);
INSERT INTO `experience_projects` (`experience_id`, `project_id`, `sort_order`) VALUES ('myvet-developer', 'myvet-business', 1);

INSERT INTO `experiences` (`id`, `kind`, `org`, `org_detail`, `title`, `detail`, `period`, `narrative`, `start_date`, `end_date`, `current`, `sort_order`) VALUES ('myvet-engineer', 'work', 'MyVet', '2 ruoli nella stessa azienda', 'Software Engineer', 'Software Engineer', 'apr 2024 - apr 2026', 'Cresco come Software Engineer: seguo il prodotto dall''idea alla pubblicazione, tra architettura, scelte tecniche e manutenzione nel tempo.', '2024-04', '2026-04', 0, 2);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-engineer', 'skill-mapbox', 0);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-engineer', 'skill-cloudflare', 1);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-engineer', 'skill-posthog', 2);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-engineer', 'skill-swift-swiftui', 3);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-engineer', 'skill-mvvm', 4);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-engineer', 'skill-stripe', 5);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('myvet-engineer', 'skill-software-architecture', 6);
INSERT INTO `experience_projects` (`experience_id`, `project_id`, `sort_order`) VALUES ('myvet-engineer', 'swiftui', 0);
INSERT INTO `experience_projects` (`experience_id`, `project_id`, `sort_order`) VALUES ('myvet-engineer', 'myvet-diet', 1);

INSERT INTO `experiences` (`id`, `kind`, `org`, `org_detail`, `title`, `detail`, `period`, `narrative`, `start_date`, `end_date`, `current`, `sort_order`) VALUES ('egaf-engineer', 'work', 'Egaf Edizioni', 'Azienda attuale', 'Software Engineer', 'Ruolo attuale', 'da apr 2026', 'Oggi lavoro in Egaf Edizioni come Software Engineer. Prodotti reali e tecnologie scelte in base al problema, non alle mode.', '2026-04', '2027-01', 1, 3);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('egaf-engineer', 'skill-lit', 0);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('egaf-engineer', 'skill-web-components', 1);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('egaf-engineer', 'skill-typescript', 2);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('egaf-engineer', 'skill-storybook', 3);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('egaf-engineer', 'skill-wcag', 4);
INSERT INTO `experience_projects` (`experience_id`, `project_id`, `sort_order`) VALUES ('egaf-engineer', 'egaf-ui', 0);
INSERT INTO `experience_projects` (`experience_id`, `project_id`, `sort_order`) VALUES ('egaf-engineer', 'tribuna', 1);

INSERT INTO `experiences` (`id`, `kind`, `org`, `org_detail`, `title`, `detail`, `period`, `narrative`, `start_date`, `end_date`, `current`, `sort_order`) VALUES ('itt-diploma', 'education', 'ITT Blaise Pascal', 'Indirizzo informatico', 'Diploma', 'Istituto tecnico informatico', 'set 2016 - giu 2022', 'Il punto di partenza: istituto tecnico a indirizzo informatico. Qui ho iniziato con C# e lo sviluppo web, ed è diventato il mestiere che faccio.', '2016-09', '2022-07', 0, 4);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('itt-diploma', 'skill-net-c', 0);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('itt-diploma', 'skill-web-development', 1);

INSERT INTO `experiences` (`id`, `kind`, `org`, `org_detail`, `title`, `detail`, `period`, `narrative`, `start_date`, `end_date`, `current`, `sort_order`) VALUES ('unibo-degree', 'education', 'Universita di Bologna', 'Bachelor of Engineering', 'Computer Science & Software Engineering', 'Bachelor of Engineering', 'da set 2022', 'In parallelo al lavoro, il percorso in Computer Science & Software Engineering per costruire basi solide oltre alla pratica.', '2022-09', '2027-01', 0, 5);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('unibo-degree', 'skill-software-architecture', 0);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('unibo-degree', 'skill-uml', 1);
INSERT INTO `experience_skills` (`experience_id`, `skill_id`, `sort_order`) VALUES ('unibo-degree', 'skill-python', 2);

