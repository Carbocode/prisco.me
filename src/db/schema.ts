import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

const authId = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const authCreatedAt = (name = "created_at") =>
  integer(name, { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

/** Tabelle Better Auth. Le proprieta seguono lo schema atteso dall'adapter. */
export const user = sqliteTable("user", {
  id: authId(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: authCreatedAt(),
  updatedAt: authCreatedAt("updated_at"),
  role: text("role").default("user"),
  banned: integer("banned", { mode: "boolean" }).default(false),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires", { mode: "timestamp_ms" }),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" }).default(false),
});

export const session = sqliteTable(
  "session",
  {
    id: authId(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: authCreatedAt(),
    updatedAt: authCreatedAt("updated_at"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: authId(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: authCreatedAt(),
    updatedAt: authCreatedAt("updated_at"),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: authId(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: authCreatedAt(),
    updatedAt: authCreatedAt("updated_at"),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const twoFactor = sqliteTable(
  "two_factor",
  {
    id: authId(),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    verified: integer("verified", { mode: "boolean" }).default(true),
    failedVerificationCount: integer("failed_verification_count").default(0),
    lockedUntil: integer("locked_until", { mode: "timestamp_ms" }),
  },
  (table) => [
    index("two_factor_secret_idx").on(table.secret),
    index("two_factor_user_id_idx").on(table.userId),
  ],
);

export const passkey = sqliteTable(
  "passkey",
  {
    id: authId(),
    name: text("name"),
    publicKey: text("public_key").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    credentialID: text("credential_id").notNull(),
    counter: integer("counter").notNull(),
    deviceType: text("device_type").notNull(),
    backedUp: integer("backed_up", { mode: "boolean" }).notNull(),
    transports: text("transports"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }),
    aaguid: text("aaguid"),
  },
  (table) => [
    index("passkey_user_id_idx").on(table.userId),
    index("passkey_credential_id_idx").on(table.credentialID),
  ],
);

export const jwks = sqliteTable("jwks", {
  id: authId(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: authCreatedAt(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
});

export const oauthClient = sqliteTable(
  "oauth_client",
  {
    id: authId(),
    clientId: text("client_id").notNull().unique(),
    clientSecret: text("client_secret"),
    disabled: integer("disabled", { mode: "boolean" }).default(false),
    skipConsent: integer("skip_consent", { mode: "boolean" }),
    enableEndSession: integer("enable_end_session", { mode: "boolean" }),
    subjectType: text("subject_type"),
    scopes: text("scopes", { mode: "json" }).$type<string[]>(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
    name: text("name"),
    uri: text("uri"),
    icon: text("icon"),
    contacts: text("contacts", { mode: "json" }).$type<string[]>(),
    tos: text("tos"),
    policy: text("policy"),
    softwareId: text("software_id"),
    softwareVersion: text("software_version"),
    softwareStatement: text("software_statement"),
    redirectUris: text("redirect_uris", { mode: "json" }).$type<string[]>().notNull(),
    postLogoutRedirectUris: text("post_logout_redirect_uris", { mode: "json" }).$type<string[]>(),
    tokenEndpointAuthMethod: text("token_endpoint_auth_method"),
    grantTypes: text("grant_types", { mode: "json" }).$type<string[]>(),
    responseTypes: text("response_types", { mode: "json" }).$type<string[]>(),
    public: integer("public", { mode: "boolean" }),
    type: text("type"),
    requirePKCE: integer("require_pkce", { mode: "boolean" }),
    referenceId: text("reference_id"),
    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
  },
  (table) => [index("oauth_client_user_id_idx").on(table.userId)],
);

export const oauthRefreshToken = sqliteTable(
  "oauth_refresh_token",
  {
    id: authId(),
    token: text("token").notNull().unique(),
    clientId: text("client_id")
      .notNull()
      .references(() => oauthClient.clientId, { onDelete: "cascade" }),
    sessionId: text("session_id").references(() => session.id, { onDelete: "set null" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    referenceId: text("reference_id"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    revoked: integer("revoked", { mode: "timestamp_ms" }),
    authTime: integer("auth_time", { mode: "timestamp_ms" }),
    scopes: text("scopes", { mode: "json" }).$type<string[]>().notNull(),
  },
  (table) => [
    index("oauth_refresh_client_id_idx").on(table.clientId),
    index("oauth_refresh_session_id_idx").on(table.sessionId),
    index("oauth_refresh_user_id_idx").on(table.userId),
  ],
);

export const oauthAccessToken = sqliteTable(
  "oauth_access_token",
  {
    id: authId(),
    token: text("token").notNull().unique(),
    clientId: text("client_id")
      .notNull()
      .references(() => oauthClient.clientId, { onDelete: "cascade" }),
    sessionId: text("session_id").references(() => session.id, { onDelete: "set null" }),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    referenceId: text("reference_id"),
    refreshId: text("refresh_id").references(() => oauthRefreshToken.id, { onDelete: "set null" }),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    scopes: text("scopes", { mode: "json" }).$type<string[]>().notNull(),
  },
  (table) => [
    index("oauth_access_client_id_idx").on(table.clientId),
    index("oauth_access_session_id_idx").on(table.sessionId),
    index("oauth_access_user_id_idx").on(table.userId),
    index("oauth_access_refresh_id_idx").on(table.refreshId),
  ],
);

export const oauthConsent = sqliteTable(
  "oauth_consent",
  {
    id: authId(),
    clientId: text("client_id")
      .notNull()
      .references(() => oauthClient.clientId, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    referenceId: text("reference_id"),
    scopes: text("scopes", { mode: "json" }).$type<string[]>().notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("oauth_consent_client_id_idx").on(table.clientId),
    index("oauth_consent_user_id_idx").on(table.userId),
  ],
);

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
