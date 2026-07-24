import type { ImgHTMLAttributes } from "react";

interface MoonProps extends ImgHTMLAttributes<HTMLImageElement> {}

export default function Moon({ className, alt, ...props }: MoonProps) {
  return <img src="/home/moon.svg" alt={alt ?? ""} className={className} {...props} />;
}
