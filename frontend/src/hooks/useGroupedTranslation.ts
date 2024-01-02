import { useContext } from "react";
import { TranslationObjPost, postTranslateGroup } from "../api/postTranslateGroup";
import { TranslateContext } from "../components/TranslateProvider";

export type TranslationItem = {
	text: string;
	updatedAt?: number;
	locationURL?: string;
	translateUserId?: string;
};

type LanguageMap = Map<string, TranslationItem>;

const GroupedTranslationContainer = new Map<string, LanguageMap>();

const STORAGE_KEY = "groupedTranslations";

export const useGroupedTranslation = () => {
	const {
		settings: { userLanguage, serverURL },
		rerenderHelperRevers,
	} = useContext(TranslateContext);

	const calculateChangedItemsPercentage = (country: string, pageUrl?: string, itemsPerPage?: number) => {
		const componentsPerPage = itemsPerPage || Array.from(document.querySelectorAll("[data-translate]")).length;
		const pageUrlPerPage = pageUrl || location.href;

		const languageMap = GroupedTranslationContainer.get(country);
		if (!languageMap) {
			return 0;
		}

		const translationItems = Array.from(languageMap.values());
		const filteredItems = translationItems.filter(
			(item) => item.locationURL === pageUrlPerPage && item.updatedAt !== undefined,
		);

		const totalItems = filteredItems.length;
		const changedItemsPercentage = (totalItems / componentsPerPage) * 100;

		return changedItemsPercentage;
	};

	const updateGroupTranslation = (language: string, key: string, translation: TranslationItem) => {
		let languageMap = GroupedTranslationContainer.get(language);

		if (!languageMap) {
			languageMap = new Map<string, TranslationItem>();
			GroupedTranslationContainer.set(language, languageMap);
		}

		languageMap.set(key, translation);
		saveToLocalStorage();
		calculateChangedItemsPercentage(language);
		rerenderHelperRevers();
		// TODO вори стейт якйи будеш експортувати як число відсотків для ренжа
	};

	const resetGroup = () => {
		GroupedTranslationContainer.clear();
		rerenderHelperRevers()
		clearLocalStorage();
	};

	const serverPush = async () => {
		const obj: TranslationObjPost = {};
		GroupedTranslationContainer.forEach((languageMap, language: string) => {
			obj[language] = Object.fromEntries(languageMap);
		});

		// console.log("====================================");
		console.log(obj);
		// resetGroup();
		// console.log(GroupedTranslationContainer);
		// console.log("====================================");
		try {
			await postTranslateGroup(serverURL, obj, {});
			resetGroup();

		// const cacheFromSessionStorage = sessionStorage.getItem(String(keyRef.current));
		// if (cacheFromSessionStorage) {
		// 	return new Map(JSON.parse(cacheFromSessionStorage));
		// }
		// return new Map();

		// const translateList = JSON.stringify(Array.from(translationCache.entries()));
		// if (translateList.length > 0) {
		// 	sessionStorage.setItem(String(keyRef.current), translateList);
		// }

		} catch (error) {
			console.error("Error post translation:", error);
		}
	};

	const serverPushPage = async (path: string, lang: string) => {
		const languageMap = GroupedTranslationContainer.get(lang);

		if (languageMap) {
			const filteredItems = Array.from(languageMap).reduce((acc, [key, value]) => {
				if (value.locationURL === path) {
					acc[key] = value;
				}
				return acc;
			}, {} as Record<string, TranslationItem>);

			try {
				await postTranslateGroup(serverURL, { [lang]: filteredItems }, {});
				resetGroup();
			} catch (error) {
				console.error("Error post translation:", error);
			}
		}
	};

	const resetGroupPage = (path: string, lang: string) => {
		const languageMap = GroupedTranslationContainer.get(lang);

		if (languageMap) {
			for (const [key, value] of languageMap.entries()) {
				if (value.locationURL === path) {
					languageMap.delete(key);
				}
			}
		}
		saveToLocalStorage();
	};

	const saveToLocalStorage = () => {
		const obj: Record<string, Record<string, TranslationItem>> = {};
		GroupedTranslationContainer.forEach((languageMap, language) => {
			obj[language] = Object.fromEntries(languageMap) as Record<string, TranslationItem>;
		});

		const json = JSON.stringify(obj);
		localStorage.setItem(STORAGE_KEY, json);
	};

	const loadFromLocalStorage = () => {
		const json = localStorage.getItem(STORAGE_KEY);

		if (json) {
			const obj = JSON.parse(json);
			Object.entries(obj).forEach(([language, translations]: [string, unknown]) => {
				const languageMap = new Map<string, TranslationItem>(
					Object.entries(translations as Record<string, TranslationItem>),
				);
				GroupedTranslationContainer.set(language, languageMap);
			});
		}
	};

	const clearLocalStorage = () => {
		localStorage.removeItem(STORAGE_KEY);
	};

	// Load data from localStorage on component mount
	loadFromLocalStorage();

	return {
		GroupedTranslationContainer,
		updateGroupTranslation,
		resetGroup,
		serverPush,
		serverPushPage,
		resetGroupPage,
		calculateChangedItemsPercentage,
	};
};
