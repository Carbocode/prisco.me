export type Node = Record<string, unknown> & {
  type?: string;
  children?: Node[];
  content?: Node[];
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
};

export type CmsMediaView = { url: string; altText?: string | null; caption?: string | null };

export type TocHeading = { depth: number; id: string; title: string };
