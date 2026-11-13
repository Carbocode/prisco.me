import { createContext } from "react";

export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  altText: string | null;
  mimeType: string;
};

export const MediaContext = createContext<Map<string, MediaItem>>(new Map());
