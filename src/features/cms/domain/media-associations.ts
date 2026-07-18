import type { CmsDocument, CmsNode } from "./cms-document";

export type MediaUsage = {
  articleCovers: number;
  articleContent: number;
  categoryHeroes: number;
  total: number;
};

export const emptyMediaUsage = (): MediaUsage => ({
  articleCovers: 0,
  articleContent: 0,
  categoryHeroes: 0,
  total: 0,
});

export function countMediaInDocument(document: CmsDocument, mediaId: string) {
  return countMediaInNodes(document.content, mediaId);
}

export function mediaIdsInDocument(document: CmsDocument) {
  const ids = new Set<string>();
  collectMediaIds(document.content, ids);
  return ids;
}

export function removeMediaFromDocument(document: CmsDocument, mediaId: string): CmsDocument {
  return {
    ...document,
    content: removeMediaFromNodes(document.content, mediaId),
  };
}

function collectMediaIds(nodes: CmsNode[] | undefined, ids: Set<string>) {
  for (const node of nodes ?? []) {
    const mediaId = mediaIdFromNode(node);
    if (mediaId) ids.add(mediaId);
    collectMediaIds(node.content, ids);
    collectMediaIds(node.children, ids);
  }
}

function countMediaInNodes(nodes: CmsNode[] | undefined, mediaId: string): number {
  return (nodes ?? []).reduce((total, node) => {
    const own = mediaIdFromNode(node) === mediaId ? 1 : 0;
    return (
      total +
      own +
      countMediaInNodes(node.content, mediaId) +
      countMediaInNodes(node.children, mediaId)
    );
  }, 0);
}

function removeMediaFromNodes(nodes: CmsNode[] | undefined, mediaId: string): CmsNode[] {
  return (nodes ?? []).flatMap((node) => {
    if (mediaIdFromNode(node) === mediaId) return [];
    return [
      {
        ...node,
        ...(Array.isArray(node.content)
          ? { content: removeMediaFromNodes(node.content, mediaId) }
          : {}),
        ...(Array.isArray(node.children)
          ? { children: removeMediaFromNodes(node.children, mediaId) }
          : {}),
      },
    ];
  });
}

function mediaIdFromNode(node: CmsNode) {
  if (node.type !== "mediaImage") return null;
  if (typeof node.mediaId === "string") return node.mediaId;
  if (!node.attrs || typeof node.attrs !== "object") return null;
  const mediaId = (node.attrs as Record<string, unknown>).mediaId; // oxlint-disable-line typescript/no-unsafe-type-assertion
  return typeof mediaId === "string" ? mediaId : null;
}
