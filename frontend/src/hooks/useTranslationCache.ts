import { useContext, useEffect, useRef, useState } from "react";
import { getTranslate } from "../api/getTranslate";
import { TranslateContext } from "../components/TranslateProvider";

export const useTranslationCache = () => {
	const keyRef = useRef<string | null>(null);
	const textRef = useRef<string | null>(null);
	const [translationCache, setTranslationCache] = useState(() => {
		const cacheFromSessionStorage = sessionStorage.getItem(String(keyRef.current));
		if (cacheFromSessionStorage) {
			return new Map(JSON.parse(cacheFromSessionStorage));
		}
		return new Map();
	});

	const {
		settings: { userLanguage, siteLanguage, serverURL },
		rerenderHelperRevers,
	} = useContext(TranslateContext);

	const setKey = (key: string, text?: string) => {
		keyRef.current = key;
		if (text) textRef.current = text;
	};

	// const updateSession = () => {
	// 	if (keyRef.current && translationCache) {
	// 		const translateList = JSON.stringify(Array.from(translationCache.entries()));
	// 		if (translateList.length > 0) {
	// 			sessionStorage.setItem(String(keyRef.current), translateList);
	// 		}
	// 	}
	// 	rerenderHelperRevers();
	// };

	const getTranslation = async (originalText: string) => {
		if (!keyRef) {
			return null;
		}

		if (siteLanguage === userLanguage) {
			return originalText;
		}

		if (translationCache) {
			if (translationCache.has(userLanguage) && translationCache.size > 0) {
				return translationCache.get(userLanguage);
			}
		}

		const cacheFromSessionStorage = sessionStorage.getItem(String(keyRef.current));
		if (cacheFromSessionStorage) {
			const res = new Map(JSON.parse(cacheFromSessionStorage)).get(
				userLanguage || localStorage.getItem("userLang") || navigator.language,
			);
			if (res) return res;
		}

		if (userLanguage && keyRef.current && userLanguage !== siteLanguage) {
			try {
				const response = await getTranslate(serverURL, {
					languageCode: userLanguage || localStorage.getItem("userLang") || navigator.language,
					translationKey: keyRef.current,

					// autoGoogleTranslate: String(autoGoogleTranslate || false)
					// ...(autoTranslate && { autoTranslate: autoTranslate }),

					// В теорії прод
					// ...(autoGoogleTranslate && {
					// 	autoGoogleTranslate: String(autoGoogleTranslate),
					// 	originalText: String(textRef.current),
					// }),
				});

				const translation = response.correspondsLanguage ? response.translation : originalText;
				// if (translation !== originalText) {
				setTranslationCache((prevCache) => {
					const newCache = new Map(prevCache);
					newCache.set(userLanguage, translation);
					return newCache;
				});
				// }
				// updateSession();
				return translation;
			} catch (error) {
				console.error("Error fetching translation:", error);
				return originalText;
			}
		}

		return originalText;
	};

	useEffect(() => {
		if (keyRef.current) {
			setTranslationCache(() => {
				const cacheFromSessionStorage = sessionStorage.getItem(String(keyRef.current));
				if (cacheFromSessionStorage) {
					return new Map(JSON.parse(cacheFromSessionStorage));
				}
				return new Map();
			});
		}
	}, [keyRef]);

	useEffect(() => {
		if (keyRef.current && translationCache) {
			const translateList = JSON.stringify(Array.from(translationCache.entries()));
			if (translateList.length > 0) {
				sessionStorage.setItem(String(keyRef.current), translateList);
			}
		}
	}, [translationCache, userLanguage]);

	return { getTranslation, setKey };
};
