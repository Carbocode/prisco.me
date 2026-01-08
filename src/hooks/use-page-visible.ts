import { useEffect, useState } from "react";

export default function usePageVisible() {
	const [isVisible, setIsVisible] = useState(() => {
		if (typeof document === "undefined") {
			return true;
		}
		return document.visibilityState === "visible";
	});

	useEffect(() => {
		const handleVisibility = () => {
			setIsVisible(document.visibilityState === "visible");
		};
		const handleFocus = () => {
			setIsVisible(true);
		};
		const handleBlur = () => {
			setIsVisible(false);
		};

		document.addEventListener("visibilitychange", handleVisibility);
		window.addEventListener("focus", handleFocus);
		window.addEventListener("blur", handleBlur);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibility);
			window.removeEventListener("focus", handleFocus);
			window.removeEventListener("blur", handleBlur);
		};
	}, []);

	return isVisible;
}
