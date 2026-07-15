"use client";

import { createContext, useContext } from "react";

export type MediaKind = "audio" | "file" | "image" | "video";

export type EditorActions = {
  onMedia: (type: MediaKind) => void;
  onEmbed: () => void;
};

const EditorActionsContext = createContext<EditorActions>({
  onMedia: () => {},
  onEmbed: () => {},
});

export const EditorActionsProvider = EditorActionsContext.Provider;

export function useEditorActions() {
  return useContext(EditorActionsContext);
}
