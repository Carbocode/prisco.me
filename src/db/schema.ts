import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contactRequests = sqliteTable("contact_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  interest: text("interest"),
  message: text("message").notNull(),
  consentToContact: integer("consent_to_contact", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type ContactRequest = InferSelectModel<typeof contactRequests>;
export type NewContactRequest = InferInsertModel<typeof contactRequests>;

/**
 * Competenze tecniche. Ogni skill conserva il proprio logo (`icon`) e il colore
 * (`color`) usati per il rendering, così da poterli aggiornare manualmente dal
 * database senza toccare il codice. `mark` e `fluentIcon` sono i fallback usati
 * quando non esiste un logo dedicato.
 */
export const skills = sqliteTable("skills", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  /** Nome visualizzato, univoco. */
  name: text("name").notNull().unique(),
  /** Slug del logo (Simple Icons / logo dedicato). Null → si usa il fallback. */
  icon: text("icon"),
  /** Classi Tailwind che definiscono il colore del chip (tint/bg/border). */
  color: text("color"),
  /** Testo di fallback quando non c'è un logo (es. "TS"). */
  mark: text("mark"),
  /** Nome dell'icona Fluent Color usata come ultimo fallback. */
  fluentIcon: text("fluent_icon"),
  /** Riga del marquee in home (1-4). Null → non compare nel marquee. */
  marqueeRow: integer("marquee_row"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

/** Progetti del portfolio. */
export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  category: text("category").notNull(),
  period: text("period"),
  image: text("image"),
  demoUrl: text("demo_url"),
  repositoryUrl: text("repository_url"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

/** Sezioni descrittive di un progetto (una-a-molti). */
export const projectSections = sqliteTable("project_sections", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  /** Elenco puntato, serializzato in JSON. */
  bullets: text("bullets"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * Esperienze di carriera e formazione mostrate nella pagina "Chi sono".
 * `kind` distingue lavoro e formazione; `org` raggruppa più ruoli della stessa
 * organizzazione nella stessa colonna del gantt.
 */
export const experiences = sqliteTable("experiences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  kind: text("kind").notNull(),
  org: text("org").notNull(),
  orgDetail: text("org_detail"),
  title: text("title").notNull(),
  detail: text("detail"),
  period: text("period").notNull(),
  narrative: text("narrative").notNull(),
  /** Mese di inizio in formato "YYYY-MM". */
  startDate: text("start_date").notNull(),
  /** Mese di fine in formato "YYYY-MM". */
  endDate: text("end_date").notNull(),
  current: integer("current", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

/** Collegamento molti-a-molti tra progetti e skill. */
export const projectSkills = sqliteTable(
  "project_skills",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.skillId] })],
);

/** Collegamento molti-a-molti tra progetti e categorie. */
export const projectCategories = sqliteTable(
  "project_categories",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.category] })],
);

/** Collegamento molti-a-molti tra esperienze e skill. */
export const experienceSkills = sqliteTable(
  "experience_skills",
  {
    experienceId: text("experience_id")
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.experienceId, table.skillId] })],
);

/** Collegamento molti-a-molti tra esperienze e progetti. */
export const experienceProjects = sqliteTable(
  "experience_projects",
  {
    experienceId: text("experience_id")
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.experienceId, table.projectId] })],
);

export type SkillRow = InferSelectModel<typeof skills>;
export type NewSkillRow = InferInsertModel<typeof skills>;
export type ProjectRow = InferSelectModel<typeof projects>;
export type NewProjectRow = InferInsertModel<typeof projects>;
export type ProjectSectionRow = InferSelectModel<typeof projectSections>;
export type ExperienceRow = InferSelectModel<typeof experiences>;
