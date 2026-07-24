import type { ImgHTMLAttributes } from "react";

type CloudVariant = 1 | 2 | 3;

interface CloudProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: CloudVariant;
}

const cloudSources: Record<CloudVariant, string> = {
  1: "/home/cloud-1.svg",
  2: "/home/cloud-2.svg",
  3: "/home/cloud-3.svg",
};

const cloudDimensions: Record<CloudVariant, { width: number; height: number }> = {
  1: { width: 450, height: 128 },
  2: { width: 556, height: 147 },
  3: { width: 421, height: 110 },
};

export default function Cloud({ variant = 1, alt, className, ...props }: CloudProps) {
  const dimensions = cloudDimensions[variant];

  return (
    <img
      src={cloudSources[variant]}
      alt={alt ?? ""}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      {...props}
    />
  );
}
