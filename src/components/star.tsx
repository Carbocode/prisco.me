import type { ImgHTMLAttributes } from "react";

type StarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface StarProps extends ImgHTMLAttributes<HTMLImageElement> {
	size?: StarSize;
}

const starSizes: Record<StarSize, number> = {
	xs: 12,
	sm: 16,
	md: 24,
	lg: 32,
	xl: 48,
};

export default function Star({
	size = "md",
	alt,
	className,
	width,
	height,
	...props
}: StarProps) {
	const sizeValue = starSizes[size];

	return (
		<img
			src="/home/star.svg"
			alt={alt ?? "Star"}
			className={className}
			width={width ?? sizeValue}
			height={height ?? sizeValue}
			{...props}
		/>
	);
}
