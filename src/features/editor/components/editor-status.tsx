import { useEditorSelector } from "platejs/react";

import { countWords } from "@/features/editor/editor-model";

export function EditorStatus() {
  const words = useEditorSelector((editor) => countWords(editor.api.string([])), []);
  return (
    <div className="cms-editor__status">
      {words} {words === 1 ? "parola" : "parole"}
    </div>
  );
}
