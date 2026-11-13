export const categorySchemaTypes = ["Article", "CreativeWork"] as const;
export type CategorySchemaType = (typeof categorySchemaTypes)[number];

export const CATEGORY_SCHEMA_TYPE = {
  ARTICLE: categorySchemaTypes[0],
  CREATIVE_WORK: categorySchemaTypes[1],
} as const;

export const categoryArchiveSorts = ["published_desc", "manual"] as const;
export type CategoryArchiveSort = (typeof categoryArchiveSorts)[number];

export const CATEGORY_ARCHIVE_SORT = {
  PUBLISHED_DESC: categoryArchiveSorts[0],
  MANUAL: categoryArchiveSorts[1],
} as const;

export const categoryArticleLayouts = ["card", "horizontal"] as const;
export type CategoryArticleLayout = (typeof categoryArticleLayouts)[number];

export const CATEGORY_ARTICLE_LAYOUT = {
  CARD: categoryArticleLayouts[0],
  HORIZONTAL: categoryArticleLayouts[1],
} as const;

export const categorySchemaTypeLabel: Record<CategorySchemaType, string> = {
  [CATEGORY_SCHEMA_TYPE.ARTICLE]: "Articolo",
  [CATEGORY_SCHEMA_TYPE.CREATIVE_WORK]: "Opera / progetto",
};

export const categoryArchiveSortLabel: Record<CategoryArchiveSort, string> = {
  [CATEGORY_ARCHIVE_SORT.PUBLISHED_DESC]: "Pubblicazione più recente",
  [CATEGORY_ARCHIVE_SORT.MANUAL]: "Ordine manuale",
};

export const categoryArticleLayoutLabel: Record<CategoryArticleLayout, string> = {
  [CATEGORY_ARTICLE_LAYOUT.CARD]: "Card",
  [CATEGORY_ARTICLE_LAYOUT.HORIZONTAL]: "Orizzontale",
};

export const defaultCategoryConfig = {
  schemaType: CATEGORY_SCHEMA_TYPE.ARTICLE,
  archiveSort: CATEGORY_ARCHIVE_SORT.PUBLISHED_DESC,
  articleLayout: CATEGORY_ARTICLE_LAYOUT.CARD,
  archiveEyebrow: "Categoria",
} as const;

export function isCategorySchemaType(value: unknown): value is CategorySchemaType {
  return categorySchemaTypes.some((item) => item === value);
}

export function isCategoryArchiveSort(value: unknown): value is CategoryArchiveSort {
  return categoryArchiveSorts.some((item) => item === value);
}

export function isCategoryArticleLayout(value: unknown): value is CategoryArticleLayout {
  return categoryArticleLayouts.some((item) => item === value);
}
