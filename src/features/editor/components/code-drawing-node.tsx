"use client";

import type { CodeDrawingType, TCodeDrawingElement, ViewMode } from "@platejs/code-drawing";
import {
  CODE_DRAWING_TYPE_ARRAY,
  DEFAULT_MIN_HEIGHT,
  DOWNLOAD_FILENAME,
  downloadImage,
  RENDER_DEBOUNCE_DELAY,
  renderCodeDrawing,
  VIEW_MODE,
  VIEW_MODE_ARRAY,
} from "@platejs/code-drawing";
import debounce from "lodash/debounce.js";
import { DownloadIcon, Trash2 } from "lucide-react";
import type { PlateElementProps } from "platejs/react";
import { PlateElement, useEditorRef, useElement, useReadOnly } from "platejs/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

function createDebouncedCodeDrawingRenderer(
  setImage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
) {
  let lastRequestId = 0;

  return debounce(async (code: string | undefined, drawingType: CodeDrawingType | undefined) => {
    lastRequestId += 1;
    const requestId = lastRequestId;

    if (!code?.trim() || !drawingType) {
      setImage("");
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imageData = await renderCodeDrawing(drawingType, code);
      if (lastRequestId === requestId) {
        setImage(imageData);
        setError(null);
      }
    } catch (err) {
      if (lastRequestId === requestId) {
        setError(err instanceof Error ? err.message : "Rendering fallito");
        setImage("");
      }
    } finally {
      if (lastRequestId === requestId) setLoading(false);
    }
  }, RENDER_DEBOUNCE_DELAY);
}

function useCodeDrawingElement({ element }: { element: TCodeDrawingElement }) {
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const [loading, setLoading] = React.useState(false);
  const [, setError] = React.useState<string | null>(null);
  const [image, setImage] = React.useState<string>("");

  const debouncedRender = React.useMemo(
    () => createDebouncedCodeDrawingRenderer(setImage, setLoading, setError),
    [],
  );

  React.useEffect(() => {
    void debouncedRender(element.data?.code, element.data?.drawingType);
    return () => {
      debouncedRender.cancel();
    };
  }, [element.data?.code, element.data?.drawingType, debouncedRender]);

  const removeNode = () => {
    if (readOnly) return;
    const path = editor.api.findPath(element);
    if (path) editor.tf.removeNodes({ at: path });
  };

  return { loading, image, removeNode };
}

export function CodeDrawingElement(props: PlateElementProps<TCodeDrawingElement>) {
  const { children } = props;
  const isMobile = useIsMobile();
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const element = useElement<TCodeDrawingElement>();
  const { removeNode, image, loading } = useCodeDrawingElement({ element });

  const handleDownload = React.useCallback(() => {
    if (!image) return;
    downloadImage(image, DOWNLOAD_FILENAME);
  }, [image]);

  const setData = React.useCallback(
    (patch: Partial<NonNullable<TCodeDrawingElement["data"]>>) => {
      const path = editor.api.findPath(element);
      if (path) editor.tf.setNodes({ data: { ...element.data, ...patch } }, { at: path });
    },
    [editor, element],
  );

  const code = element.data?.code ?? "";
  const drawingType = element.data?.drawingType ?? "Mermaid";
  const drawingMode = element.data?.drawingMode ?? "Both";

  return (
    <PlateElement {...props}>
      <div className="group relative" contentEditable={false}>
        {!readOnly && (
          <div className="absolute top-1 right-1 z-10 flex select-none items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            {image && (
              <Button
                className="size-8"
                onClick={handleDownload}
                size="icon"
                title="Esporta"
                variant="ghost"
              >
                <DownloadIcon className="size-4" />
              </Button>
            )}
            <Button
              className="size-8"
              onClick={removeNode}
              size="icon"
              title="Elimina"
              variant="ghost"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}
        <CodeDrawingPreview
          code={code}
          drawingMode={drawingMode}
          drawingType={drawingType}
          image={image}
          isMobile={isMobile}
          loading={loading}
          onCodeChange={(next) => setData({ code: next })}
          onDrawingModeChange={(next) => setData({ drawingMode: next })}
          onDrawingTypeChange={(next) => setData({ drawingType: next })}
          readOnly={readOnly}
        />
      </div>
      {children}
    </PlateElement>
  );
}

function CodeDrawingPreview({
  code,
  drawingType,
  drawingMode,
  image,
  loading,
  onCodeChange,
  onDrawingTypeChange,
  onDrawingModeChange,
  readOnly = false,
  isMobile = false,
}: {
  code: string;
  drawingType: CodeDrawingType;
  drawingMode: ViewMode;
  image: string;
  loading: boolean;
  onCodeChange: (code: string) => void;
  onDrawingTypeChange: (type: CodeDrawingType) => void;
  onDrawingModeChange: (mode: ViewMode) => void;
  readOnly?: boolean;
  isMobile?: boolean;
}) {
  const viewMode = drawingMode;
  const showCode = viewMode === VIEW_MODE.Both || viewMode === VIEW_MODE.Code;
  const showBorder = viewMode === VIEW_MODE.Both;

  const toolbar = readOnly ? null : (
    <CodeDrawingToolbar
      drawingType={drawingType}
      isMobile={isMobile}
      onDrawingModeChange={onDrawingModeChange}
      onDrawingTypeChange={onDrawingTypeChange}
      viewMode={viewMode}
    />
  );

  return (
    <div
      className={`flex ${isMobile ? "flex-col-reverse" : "flex-col"} group my-4 w-full items-stretch border bg-muted/50 md:flex-row`}
      style={{ minHeight: `${DEFAULT_MIN_HEIGHT}px` }}
    >
      {showCode && (
        <CodeDrawingTextarea
          code={code}
          isMobile={isMobile}
          onCodeChange={(e) => onCodeChange(e.target.value)}
          readOnly={readOnly}
          showBorder={showBorder}
          toolbar={viewMode === VIEW_MODE.Code ? toolbar : null}
          viewMode={viewMode}
        />
      )}

      {viewMode !== VIEW_MODE.Code && (
        <CodeDrawingPreviewArea
          code={code}
          image={image}
          isMobile={isMobile}
          loading={loading}
          showBorder={showBorder}
          toolbar={toolbar}
          viewMode={viewMode}
        />
      )}
    </div>
  );
}

function CodeDrawingToolbar({
  drawingType,
  viewMode,
  isMobile = false,
  onDrawingTypeChange,
  onDrawingModeChange,
}: {
  drawingType: CodeDrawingType;
  viewMode: ViewMode;
  isMobile?: boolean;
  onDrawingTypeChange: (type: CodeDrawingType) => void;
  onDrawingModeChange: (mode: ViewMode) => void;
}) {
  const positionClass = isMobile
    ? "flex items-center gap-2"
    : "absolute right-2 z-10 flex items-center gap-2";

  return (
    <div className={positionClass} role="toolbar">
      <Select onValueChange={(v) => v && onDrawingTypeChange(v)} value={drawingType}>
        <SelectTrigger className="h-8 w-[120px] border-0 bg-muted/50 text-xs shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-100">
          {CODE_DRAWING_TYPE_ARRAY.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => v && onDrawingModeChange(v)} value={viewMode}>
        <SelectTrigger className="h-8 w-[90px] border-0 bg-muted/50 text-xs shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-100">
          {VIEW_MODE_ARRAY.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CodeDrawingTextarea({
  code,
  viewMode,
  readOnly = false,
  isMobile = false,
  showBorder = false,
  onCodeChange,
  toolbar,
}: {
  code: string;
  viewMode: ViewMode;
  readOnly?: boolean;
  isMobile?: boolean;
  showBorder?: boolean;
  onCodeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  toolbar?: React.ReactNode;
}) {
  const isCodeOnlyMode = viewMode === VIEW_MODE.Code;
  const [internalCode, setInternalCode] = React.useState(code);
  const lastExternalCodeRef = React.useRef(code);

  React.useEffect(() => {
    if (code !== lastExternalCodeRef.current) {
      lastExternalCodeRef.current = code;
      setInternalCode(code);
    }
  }, [code]);

  return (
    <div
      className={`${isCodeOnlyMode ? "w-full" : "min-w-0 flex-1"} flex flex-col ${
        isCodeOnlyMode && !isMobile ? "relative" : ""
      } ${showBorder && !isMobile ? "border-r" : ""}`}
    >
      {toolbar && isCodeOnlyMode && (
        <div
          className={isMobile ? "mt-2 mb-2 flex justify-end px-2" : "absolute right-2 z-10 mt-2"}
        >
          {toolbar}
        </div>
      )}

      <div className="relative flex-1 rounded-md">
        <pre
          className="m-0 overflow-x-auto p-3 font-mono text-sm leading-[normal] tab-2 print:break-inside-avoid"
          style={{ minHeight: `${DEFAULT_MIN_HEIGHT}px`, height: "100%" }}
        >
          <code className="block h-full w-full">
            <textarea
              className="m-0 h-full w-full resize-none overflow-auto border-0 bg-transparent p-0 font-mono text-sm outline-none"
              onChange={(e) => {
                setInternalCode(e.target.value);
                onCodeChange(e);
              }}
              placeholder="Scrivi qui il codice del diagramma…"
              readOnly={readOnly}
              spellCheck={false}
              style={{ minHeight: `${DEFAULT_MIN_HEIGHT}px` }}
              value={internalCode}
            />
          </code>
        </pre>
      </div>
    </div>
  );
}

function CodeDrawingPreviewArea({
  image,
  loading,
  code,
  viewMode,
  isMobile = false,
  showBorder = false,
  toolbar,
}: {
  image: string;
  loading: boolean;
  code: string;
  viewMode: ViewMode;
  isMobile?: boolean;
  showBorder?: boolean;
  toolbar?: React.ReactNode;
}) {
  const showImage = viewMode === VIEW_MODE.Both || viewMode === VIEW_MODE.Image;

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col ${isMobile ? "" : "relative"} ${
        showBorder && isMobile ? "border-b" : ""
      }`}
    >
      {toolbar && (
        <div
          className={isMobile ? "mt-2 mb-2 flex justify-end px-2" : "absolute right-2 z-10 mt-2"}
        >
          {toolbar}
        </div>
      )}

      {showImage ? (
        <div className="flex flex-1 items-center justify-center rounded-md bg-muted/30 p-4">
          {loading && <div className="text-muted-foreground">Caricamento…</div>}
          {!loading && image && (
            <img alt="Diagramma" className="max-h-full max-w-full object-contain" src={image} />
          )}
          {!loading && !image && (
            <div className="text-muted-foreground">
              {code.trim() ? "Rendering…" : "L'anteprima apparirà qui"}
            </div>
          )}
        </div>
      ) : (
        <div className="pointer-events-none flex flex-1 items-center justify-center rounded-md border bg-muted/30 p-4 opacity-0" />
      )}
    </div>
  );
}
