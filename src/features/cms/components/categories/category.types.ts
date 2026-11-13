/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import {
  type CategoryArchiveSort,
  type CategoryArticleLayout,
  type CategorySchemaType,
} from "@/features/content/domain/content-category";

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  schemaType: CategorySchemaType;
  archiveSort: CategoryArchiveSort;
  articleLayout: CategoryArticleLayout;
  heroMediaId: string | null;
};

export type CategoryMedia = {
  id: string;
  filename: string;
  mimeType: string;
  url: string;
};
