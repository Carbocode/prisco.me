import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  check,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import {
  CATEGORY_ARCHIVE_SORT,
  CATEGORY_SCHEMA_TYPE,
  defaultCategoryConfig,
  type CategoryArchiveSort,
  type CategorySchemaType,
} from "@/lib/content-category";

import { user } from "./schema";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());
const timestamp = (name: string) => integer(name, { mode: "timestamp_ms" });
const createdAt = () =>
  timestamp("created_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`);
const updatedAt = () =>
  timestamp("updated_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

export const cmsMedia = sqliteTable(
  "cms_media",
  {
    id: id(),
    storageKey: text("storage_key").notNull(),
    filename: text("filename").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text"),
    caption: text("caption"),
    createdById: text("created_by_id")
      .notNull()
      .references(() => user.id),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("cms_media_storage_key_uidx").on(table.storageKey),
    index("cms_media_created_at_idx").on(table.createdAt),
    index("cms_media_deleted_at_idx").on(table.deletedAt),
    check("cms_media_size_check", sql`${table.sizeBytes} >= 0`),
    check("cms_media_width_check", sql`${table.width} IS NULL OR ${table.width} > 0`),
    check("cms_media_height_check", sql`${table.height} IS NULL OR ${table.height} > 0`),
  ],
);

export const cmsOrganizations = sqliteTable(
  "cms_organizations",
  {
    id: id(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    type: text("organization_type").notNull(),
    description: text("description"),
    websiteUrl: text("website_url"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("cms_organizations_name_uidx").on(table.name),
    uniqueIndex("cms_organizations_slug_uidx").on(table.slug),
    index("cms_organizations_type_name_idx").on(table.type, table.name),
    index("cms_organizations_deleted_at_idx").on(table.deletedAt),
    check("cms_organizations_type_check", sql`${table.type} IN ('company','education')`),
  ],
);

export const cmsArticles = sqliteTable(
  "cms_articles",
  {
    id: id(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    contentVersion: integer("content_version").notNull().default(1),
    coverMediaId: text("cover_media_id").references(() => cmsMedia.id),
    status: text("status").notNull().default("draft"),
    publishedAt: timestamp("published_at"),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id),
    organizationId: text("organization_id").references(() => cmsOrganizations.id),
    projectRole: text("project_role"),
    projectPeriod: text("project_period"),
    projectFeatured: integer("project_featured", { mode: "boolean" }).notNull().default(false),
    projectSortOrder: integer("project_sort_order").notNull().default(0),
    legacyProjectId: text("legacy_project_id"),
    lastEditedById: text("last_edited_by_id")
      .notNull()
      .references(() => user.id),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    noIndex: integer("no_index", { mode: "boolean" }).notNull().default(false),
    version: integer("version").notNull().default(1),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("cms_articles_slug_uidx").on(table.slug),
    index("cms_articles_status_published_at_idx").on(table.status, table.publishedAt),
    index("cms_articles_updated_at_idx").on(table.updatedAt),
    index("cms_articles_author_updated_at_idx").on(table.authorId, table.updatedAt),
    index("cms_articles_organization_idx").on(table.organizationId),
    uniqueIndex("cms_articles_legacy_project_uidx").on(table.legacyProjectId),
    index("cms_articles_deleted_at_idx").on(table.deletedAt),
    check(
      "cms_articles_status_check",
      sql`${table.status} IN ('draft','scheduled','published','archived')`,
    ),
    check(
      "cms_articles_publish_date_check",
      sql`${table.status} NOT IN ('published','scheduled') OR ${table.publishedAt} IS NOT NULL`,
    ),
  ],
);

export const cmsCategories = sqliteTable(
  "cms_categories",
  {
    id: id(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    schemaType: text("schema_type")
      .$type<CategorySchemaType>()
      .notNull()
      .default(CATEGORY_SCHEMA_TYPE.ARTICLE),
    archiveSort: text("archive_sort")
      .$type<CategoryArchiveSort>()
      .notNull()
      .default(CATEGORY_ARCHIVE_SORT.PUBLISHED_DESC),
    archiveEyebrow: text("archive_eyebrow").notNull().default(defaultCategoryConfig.archiveEyebrow),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("cms_categories_name_uidx").on(table.name),
    uniqueIndex("cms_categories_slug_uidx").on(table.slug),
    index("cms_categories_deleted_at_idx").on(table.deletedAt),
  ],
);

export const cmsArticleCategories = sqliteTable(
  "cms_article_categories",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => cmsArticles.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => cmsCategories.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.articleId, table.categoryId] }),
    index("cms_article_categories_category_idx").on(table.categoryId, table.articleId),
  ],
);

export const cmsTags = sqliteTable(
  "cms_tags",
  {
    id: id(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => cmsCategories.id),
    icon: text("icon"),
    color: text("color").notNull().default("text-slate-200 bg-white/10 border-white/15"),
    mark: text("mark"),
    fluentIcon: text("fluent_icon"),
    legacySkillId: text("legacy_skill_id"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("cms_tags_name_uidx").on(table.name),
    uniqueIndex("cms_tags_slug_uidx").on(table.slug),
    uniqueIndex("cms_tags_legacy_skill_uidx").on(table.legacySkillId),
    index("cms_tags_category_name_idx").on(table.categoryId, table.name),
    index("cms_tags_deleted_at_idx").on(table.deletedAt),
  ],
);

export const cmsArticleTags = sqliteTable(
  "cms_article_tags",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => cmsArticles.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => cmsTags.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.articleId, table.tagId] }),
    index("cms_article_tags_article_order_idx").on(table.articleId, table.sortOrder),
    index("cms_article_tags_tag_idx").on(table.tagId, table.articleId),
  ],
);

export const cmsArticleRevisions = sqliteTable(
  "cms_article_revisions",
  {
    id: id(),
    articleId: text("article_id")
      .notNull()
      .references(() => cmsArticles.id, { onDelete: "cascade" }),
    revision: integer("revision").notNull(),
    snapshot: text("snapshot").notNull(),
    createdById: text("created_by_id")
      .notNull()
      .references(() => user.id),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("cms_article_revisions_number_uidx").on(table.articleId, table.revision),
    index("cms_article_revisions_created_idx").on(table.articleId, table.createdAt),
  ],
);

export const cmsRedirects = sqliteTable(
  "cms_redirects",
  {
    id: id(),
    sourcePath: text("source_path").notNull(),
    destinationPath: text("destination_path").notNull(),
    statusCode: integer("status_code").notNull().default(301),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("cms_redirects_source_uidx").on(table.sourcePath),
    check("cms_redirects_status_check", sql`${table.statusCode} IN (301,302,307,308)`),
    check(
      "cms_redirects_path_check",
      sql`${table.sourcePath} LIKE '/%' AND ${table.destinationPath} LIKE '/%' AND ${table.sourcePath} != ${table.destinationPath}`,
    ),
  ],
);

export const cmsAuditLogs = sqliteTable(
  "cms_audit_logs",
  {
    id: id(),
    actorId: text("actor_id")
      .notNull()
      .references(() => user.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    metadata: text("metadata"),
    createdAt: createdAt(),
  },
  (table) => [index("cms_audit_entity_idx").on(table.entityType, table.entityId, table.createdAt)],
);

export type CmsArticleRow = InferSelectModel<typeof cmsArticles>;
export type NewCmsArticleRow = InferInsertModel<typeof cmsArticles>;
export type CmsMediaRow = InferSelectModel<typeof cmsMedia>;
export type CmsOrganizationRow = InferSelectModel<typeof cmsOrganizations>;
