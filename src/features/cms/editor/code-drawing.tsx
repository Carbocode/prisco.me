"use client";

import { CODE_DRAWING_TYPE_ARRAY } from "@platejs/code-drawing";
import { useEffect, useState } from "react";

import { renderDarkCodeDrawing } from "../../editor/code-drawing-renderer";
import { CodeDrawingViewport } from "../../editor/components/code-drawing-viewport";

export function CmsCodeDrawing({ code, drawingType }: { code: string; drawingType: string }) {
  const [image, setImage] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setImage("");
    setFailed(false);

    const validDrawingType = CODE_DRAWING_TYPE_ARRAY.find(
      (item) => item.value === drawingType,
    )?.value;
    if (!validDrawingType) {
      setFailed(true);
    } else {
      void renderDarkCodeDrawing(validDrawingType, code)
        .then((result) => {
          if (active) setImage(result);
        })
        .catch(() => {
          if (active) setFailed(true);
        });
    }

    return () => {
      active = false;
    };
  }, [code, drawingType]);

  return (
    <figure className="cms-code-drawing" aria-busy={!image && !failed}>
      {image ? <CodeDrawingViewport image={image} /> : null}
      {!image && !failed ? <span>Rendering del diagramma…</span> : null}
      {failed ? <span>Impossibile renderizzare il diagramma.</span> : null}
    </figure>
  );
}
