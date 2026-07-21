"use client";

import {
  type ResizeHandle as ResizeHandlePrimitive,
  Resizable as ResizablePrimitive,
  useResizeHandle,
  useResizeHandleState,
} from "@platejs/resizable";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

export const mediaResizeHandleVariants = cva(
  cn(
    "flex select-none justify-center",
    "after:flex after:rounded-[6px] after:bg-ring after:opacity-0 after:content-['_'] group-hover:after:opacity-100",
  ),
  {
    variants: {
      direction: {
        bottom: "-bottom-3 left-0 h-6 w-full items-end pb-3 after:h-[3px] after:w-16",
        left: "top-0 -left-3 -ml-3 h-full w-6 flex-col pl-3 after:h-16 after:w-[3px]",
        right: "top-0 -right-3 -mr-3 h-full w-6 flex-col items-end pr-3 after:h-16 after:w-[3px]",
      },
    },
  },
);

const resizeHandleVariants = cva("absolute z-40", {
  variants: {
    direction: {
      bottom: "w-full cursor-row-resize",
      left: "h-full cursor-col-resize",
      right: "h-full cursor-col-resize",
      top: "w-full cursor-row-resize",
    },
  },
});

export function ResizeHandle({
  className,
  options,
  ...props
}: React.ComponentProps<typeof ResizeHandlePrimitive> & VariantProps<typeof resizeHandleVariants>) {
  const state = useResizeHandleState(options ?? {});
  const resizeHandle = useResizeHandle(state);

  if (state.readOnly) return null;

  return (
    <div
      className={cn(resizeHandleVariants({ direction: options?.direction }), className)}
      data-resizing={state.isResizing}
      {...resizeHandle.props}
      {...props}
    />
  );
}

const resizableVariants = cva("", {
  variants: {
    align: {
      center: "mx-auto",
      left: "mr-auto",
      right: "ml-auto",
    },
  },
});

export function Resizable({
  align,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive> & VariantProps<typeof resizableVariants>) {
  return <ResizablePrimitive {...props} className={cn(resizableVariants({ align }), className)} />;
}
