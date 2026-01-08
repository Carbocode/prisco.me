import type { ImgHTMLAttributes } from "react";

interface JupiterProps extends ImgHTMLAttributes<HTMLImageElement> {}

export default function Jupiter({ className, alt, ...props }: JupiterProps) {
	return (
		<img
			src="/home/jupiter.svg"
			alt={alt ?? "Jupiter"}
			className={className}
			{...props}
		/>
	);
}
