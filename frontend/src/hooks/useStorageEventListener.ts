import { useEffect } from "react";

export const useStorageEventListener = (key: string, callback: (newValue: boolean) => void) => {
	useEffect(() => {
		const handleStorageEvent = (event: StorageEvent) => {
			if (event.key === key) {
				callback(JSON.parse(event.newValue || "false"));
			}
		};

		window.addEventListener("storage", handleStorageEvent);

		return () => {
			window.removeEventListener("storage", handleStorageEvent);
		};
	}, [key, callback]);
};