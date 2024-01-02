import { useEffect } from "react";


export const updateLocalStorage = (key: string, newValue: string) => {
	const oldValue = localStorage.getItem(key);
	localStorage.setItem(key, newValue);

	const storageEvent = new StorageEvent("storage", {
		key: key,
		oldValue: oldValue,
		newValue: newValue,
		url: window.location.href,
		storageArea: localStorage,
	});

	window.dispatchEvent(storageEvent);
};

export const useKeydownListener = (keyCode: string, callback: (event: KeyboardEvent) => void) => {
	useEffect(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.code === keyCode) {
				callback(event);
			}
		};

		window.addEventListener("keydown", handleKeydown);

		return () => {
			window.removeEventListener("keydown", handleKeydown);
		};
	}, [keyCode, callback]);
};