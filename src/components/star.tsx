import type { ImgHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

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

export default function Star({ size = "md", alt, className, onLoad, ...props }: StarProps) {
  const sizeClass = starSizeClasses[size];
  const imageRef = useRef<HTMLImageElement>(null);
  const [isReady, setIsReady] = useState(false);
  const hasEntranceAnimation = className?.includes("star-enter") ?? false;
  const baseClassName = className
    ?.split(" ")
    .filter((classNamePart) => classNamePart !== "star-enter")
    .join(" ");

  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsReady(true);
    }
  }, []);

  return (
    <img
      ref={imageRef}
      src="/home/star.svg"
      alt={alt ?? "Star"}
      className={[
        sizeClass,
        baseClassName,
        hasEntranceAnimation && isReady ? "star-enter" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      width="100"
      height="100"
      loading="eager"
      decoding="async"
      onLoad={(event) => {
        setIsReady(true);
        onLoad?.(event);
      }}
      {...props}
    />
  );
}
