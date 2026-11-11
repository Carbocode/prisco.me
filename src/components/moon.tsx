import type { ImgHTMLAttributes } from "react";

interface MoonProps extends ImgHTMLAttributes<HTMLImageElement> {}

export default function Moon({ className, alt, ...props }: MoonProps) {
  return (
    <img
      src="/home/moon.webp"
      alt={alt ?? ""}
      width="450"
      height="450"
      className={className}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      {...props}
    />
  );
}
