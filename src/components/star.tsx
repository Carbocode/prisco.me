import type { ImgHTMLAttributes } from "react";

type StarSize = "sm" | "md" | "lg" | "xl";

interface StarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: StarSize;
}

const starSizeClasses: Record<StarSize, string> = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export default function Star({ size = "md", alt, className, ...props }: StarProps) {
  const sizeClass = starSizeClasses[size];

  return (
    <img
      src="/home/star.svg"
      alt={alt ?? "Star"}
      className={[sizeClass, className].filter(Boolean).join(" ")}
      width="100"
      height="100"
      loading="eager"
      decoding="async"
      {...props}
    />
  );
}
