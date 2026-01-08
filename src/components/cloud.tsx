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

export default function Cloud({
	variant = 1,
	alt,
	className,
	...props
}: CloudProps) {
	return (
		<img
			src={cloudSources[variant]}
			alt={alt ?? "Cloud"}
			className={className}
			{...props}
		/>
	);
}
