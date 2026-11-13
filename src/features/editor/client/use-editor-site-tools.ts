import type { Value } from "platejs";
import type { PlateEditor } from "platejs/react";
import { useEffect, useEffectEvent } from "react";
import { flushSync } from "react-dom";
import { z } from "zod";

import { fromPlateValue, type CmsDocument } from "@/features/content/domain/document";
import {
  documentRevision,
  editAgentBlocks,
  editBlocksSchema,
  readBlocksSchema,
} from "@/features/editor/domain/agent-document";
import { agentWidgets } from "@/features/editor/domain/agent-widgets";
import type { MediaItem } from "@/features/editor/media-context";
import { registerSiteTools, siteTool } from "@/lib/webmcp";

export function useEditorSiteTools(
  editor: PlateEditor,
  readOnly: boolean,
  media: MediaItem[],
  onChange: (value: CmsDocument) => void,
) {
  const read = useEffectEvent((input: z.output<typeof readBlocksSchema>) => ({
    revision: documentRevision(editor.children),
    totalBlocks: editor.children.length,
    start: input.start,
    blocks: structuredClone(editor.children.slice(input.start, input.start + input.limit)),
    selection: editor.selection ? structuredClone(editor.selection) : null,
    selectedText: editor.selection ? editor.api.string(editor.selection) : "",
    readOnly,
  }));
  const listMedia = useEffectEvent((input: z.output<typeof readBlocksSchema>) => ({
    total: media.length,
    media: media.slice(input.start, input.start + input.limit),
  }));
  const edit = useEffectEvent((input: z.output<typeof editBlocksSchema>) => {
    if (readOnly) throw new Error("Editor is read-only");
    const next = editAgentBlocks(editor.children, input, new Set(media.map((item) => item.id)));
    // Use Plate transforms so normalization, history and the form's dirty state stay active.
    flushSync(() => {
      editor.tf.withoutNormalizing(() => {
        for (let i = editor.children.length - 1; i >= 0; i--) editor.tf.removeNodes({ at: [i] });
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Agent nodes have passed recursive validation.
        editor.tf.insertNodes(next as Value, { at: [0] });
      });
      // Publish form state before another tool can request a save. Slate also fires its normal callback.
      onChange(fromPlateValue(editor.children));
    });
    return {
      revision: documentRevision(editor.children),
      totalBlocks: editor.children.length,
      saved: false,
    };
  });
  useEffect(
    () =>
      registerSiteTools([
        siteTool(
          "editor_list_widgets",
          "Get examples of all supported article widgets. h1 renders as h2 because the article title owns h1. Emoji are ordinary text. Changes remain unsaved until saved in the CMS.",
          z.strictObject({}),
          true,
          () => agentWidgets,
        ),
        siteTool(
          "editor_read_blocks",
          "Read a bounded range of top-level blocks and the current selection. Use the returned revision when editing; read more ranges only when needed.",
          readBlocksSchema,
          true,
          read,
        ),
        siteTool(
          "editor_list_media",
          "List existing library media with IDs for image, audio, video and file widgets.",
          readBlocksSchema,
          true,
          listMedia,
        ),
        ...(!readOnly
          ? [
              siteTool(
                "editor_edit_blocks",
                "Insert, replace or delete a range of top-level blocks in the open editor. start is zero-based; deleteCount 0 inserts. Requires the latest revision from editor_read_blocks. Preserves ordinary editor undo. Does not save or publish.",
                editBlocksSchema,
                false,
                edit,
              ),
            ]
          : []),
      ]),
    [readOnly],
  );
}
