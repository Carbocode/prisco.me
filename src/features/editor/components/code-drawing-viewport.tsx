"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

export function CodeDrawingViewport({
  image,
  alt = "Diagramma",
  className,
}: {
  image: string;
  alt?: string;
  className?: string;
}) {
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragRef = React.useRef<{ pointerId: number; x: number; y: number } | null>(null);

  React.useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [image]);

  const changeScale = React.useCallback((delta: number) => {
    setScale((current) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current + delta));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || scale <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setPosition((current) => ({
      x: current.x + event.clientX - drag.x,
      y: current.y + event.clientY - drag.y,
    }));
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      className={cn(
        "relative flex min-h-64 flex-1 items-center justify-center overflow-hidden p-6 md:p-8",
        scale > 1 ? "touch-none cursor-grab active:cursor-grabbing" : "touch-pan-y cursor-default",
        className,
      )}
      onPointerCancel={stopDragging}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
    >
      <img
        alt={alt}
        className={cn(
          "max-h-full max-w-full select-none object-contain",
          !isDragging && "transition-transform duration-150",
        )}
        draggable={false}
        src={image}
        style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
      />

      <ButtonGroup
        aria-label="Controlli zoom del diagramma"
        className="absolute right-3 bottom-3"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <Button
          aria-label="Riduci zoom"
          disabled={scale <= MIN_SCALE}
          onClick={() => changeScale(-SCALE_STEP)}
          size="icon"
          title="Riduci zoom"
          variant="outline"
        >
          <MinusIcon />
        </Button>
        <Button
          aria-label="Aumenta zoom"
          disabled={scale >= MAX_SCALE}
          onClick={() => changeScale(SCALE_STEP)}
          size="icon"
          title="Aumenta zoom"
          variant="outline"
        >
          <PlusIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}
