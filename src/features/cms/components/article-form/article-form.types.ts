export type Existing = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  noIndex: boolean;
  version: number;
  status: string;
  publishedAt: Date | null;
  coverMediaId: string | null;
  organizationId: string | null;
  projectRole: string | null;
  projectPeriod: string | null;
  canonicalUrl: string | null;
  projectFeatured: boolean;
  projectSortOrder: number;
  categoryIds: string[];
  tagIds: string[];
  experienceIds: string[];
};

export type Category = { id: string; name: string; slug: string };

export type Tag = {
  id: string;
  name: string;
  categoryId: string;
  icon: string | null;
  color: string;
  mark: string | null;
  fluentIcon: string | null;
};

export type Organization = { id: string; name: string; type: string };

export type Media = {
  id: string;
  filename: string;
  url: string;
  altText: string | null;
  mimeType: string;
};

export type Revision = { id: string; revision: number; createdAt: Date; snapshot: string };

export type ArticleFormProps = {
  article?: Existing;
  categories?: Category[];
  tags?: Tag[];
  organizations?: Organization[];
  experiences?: { id: string; title: string; org: string }[];
  media?: Media[];
  revisions?: Revision[];
};
