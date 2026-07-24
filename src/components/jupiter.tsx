import type { ImgHTMLAttributes } from "react";

interface JupiterProps extends ImgHTMLAttributes<HTMLImageElement> {}

export default function Jupiter({ className, alt, ...props }: JupiterProps) {
  return (
    <img
      src="/home/jupiter.svg"
      alt={alt ?? ""}
      width="450"
      height="450"
      className={className}
      {...props}
    />
  );
}
