import { useCallback, useLayoutEffect, useRef, useState, type ImgHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type HoverAnimatedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  containerClassName?: string;
};

/**
 * Shows a canvas snapshot while idle and reveals the source image on mouse hover.
 * Drawing the already-loaded image does not require canvas read access, so this
 * also works with media served by the public R2 domain without CORS headers.
 */
export function HoverAnimatedImage({
  alt,
  className,
  containerClassName,
  onLoad,
  ...props
}: HoverAnimatedImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snapshotReady, setSnapshotReady] = useState(false);

  const captureSnapshot = useCallback((image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !image.complete || !image.naturalWidth || !image.naturalHeight) return;

    const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    setSnapshotReady(true);
  }, []);

  useLayoutEffect(() => {
    setSnapshotReady(false);
    if (imageRef.current?.complete) captureSnapshot(imageRef.current);
  }, [captureSnapshot, props.src]);

  return (
    <span className={cn("group/animated-webp relative block overflow-hidden", containerClassName)}>
      <img
        {...props}
        ref={imageRef}
        alt={alt}
        className={cn(
          className,
          snapshotReady && "opacity-0 group-hover/animated-webp:opacity-100",
        )}
        onLoad={(event) => {
          onLoad?.(event);
          captureSnapshot(event.currentTarget);
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 size-full opacity-0",
          snapshotReady && "opacity-100 group-hover/animated-webp:opacity-0",
          className,
        )}
      />
    </span>
  );
}
