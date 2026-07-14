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

export const cmsServices = sqliteTable(
  "cms_services",
  {
    id: id(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    shortDescription: text("short_description"),
    content: text("content").notNull(),
    contentVersion: integer("content_version").notNull().default(1),
    imageMediaId: text("image_media_id").references(() => cmsMedia.id),
    icon: text("icon"),
    priceLabel: text("price_label"),
    callToActionLabel: text("call_to_action_label"),
    callToActionUrl: text("call_to_action_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    status: text("status").notNull().default("draft"),
    publishedAt: timestamp("published_at"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    noIndex: integer("no_index", { mode: "boolean" }).notNull().default(false),
    createdById: text("created_by_id")
      .notNull()
      .references(() => user.id),
    lastEditedById: text("last_edited_by_id")
      .notNull()
      .references(() => user.id),
    version: integer("version").notNull().default(1),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("cms_services_slug_uidx").on(table.slug),
    index("cms_services_status_sort_order_idx").on(table.status, table.sortOrder),
    index("cms_services_updated_at_idx").on(table.updatedAt),
    index("cms_services_deleted_at_idx").on(table.deletedAt),
    check("cms_services_status_check", sql`${table.status} IN ('draft','published','archived')`),
    check(
      "cms_services_publish_date_check",
      sql`${table.status} != 'published' OR ${table.publishedAt} IS NOT NULL`,
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

export const cmsServiceRevisions = sqliteTable(
  "cms_service_revisions",
  {
    id: id(),
    serviceId: text("service_id")
      .notNull()
      .references(() => cmsServices.id, { onDelete: "cascade" }),
    revision: integer("revision").notNull(),
    snapshot: text("snapshot").notNull(),
    createdById: text("created_by_id")
      .notNull()
      .references(() => user.id),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("cms_service_revisions_number_uidx").on(table.serviceId, table.revision),
    index("cms_service_revisions_created_idx").on(table.serviceId, table.createdAt),
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
export type CmsServiceRow = InferSelectModel<typeof cmsServices>;
export type CmsMediaRow = InferSelectModel<typeof cmsMedia>;
