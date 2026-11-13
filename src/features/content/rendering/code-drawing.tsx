"use client";

import { CODE_DRAWING_TYPE_ARRAY } from "@platejs/code-drawing";
import { useEffect, useState } from "react";

import { CodeDrawingViewport } from "@/features/editor/components/nodes/code-drawing-viewport";

import { renderDarkCodeDrawing } from "./code-drawing-renderer";

export function CmsCodeDrawing({ code, drawingType }: { code: string; drawingType: string }) {
  const [result, setResult] = useState<{
    code: string;
    drawingType: string;
    image?: string;
    failed?: boolean;
  }>();
  const validDrawingType = CODE_DRAWING_TYPE_ARRAY.find(
    (item) => item.value === drawingType,
  )?.value;
  const current = result?.code === code && result.drawingType === drawingType ? result : undefined;
  const image = current?.image;
  const failed = !validDrawingType || current?.failed;

  useEffect(() => {
    if (!validDrawingType) return undefined;
    let active = true;
    void renderDarkCodeDrawing(validDrawingType, code)
      .then((renderedImage) => {
        if (active) setResult({ code, drawingType, image: renderedImage });
      })
      .catch(() => {
        if (active) setResult({ code, drawingType, failed: true });
      });
    return () => {
      active = false;
    };
  }, [code, drawingType, validDrawingType]);

  return (
    <figure className="cms-code-drawing" aria-busy={!image && !failed}>
      {image ? <CodeDrawingViewport image={image} /> : null}
      {!image && !failed ? <span>Rendering del diagramma…</span> : null}
      {failed ? <span>Impossibile renderizzare il diagramma.</span> : null}
    </figure>
  );
}
