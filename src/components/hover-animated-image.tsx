import { useRef, type ImgHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type HoverAnimatedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad"> & {
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
  ...props
}: HoverAnimatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <span className={cn("group/animated-webp relative block overflow-hidden", containerClassName)}>
      <img
        {...props}
        alt={alt}
        className={cn(className, "opacity-0 group-hover/animated-webp:opacity-100")}
        onLoad={(event) => {
          const image = event.currentTarget;
          const canvas = canvasRef.current;
          if (!canvas || !image.naturalWidth || !image.naturalHeight) return;

          const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 size-full opacity-100 group-hover/animated-webp:opacity-0",
          className,
        )}
      />
    </span>
  );
}
