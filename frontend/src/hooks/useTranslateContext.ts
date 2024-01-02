import { TranslateEditMode, TypeTranslateContextValue } from "../components/TranslateProvider";
import { useState } from "react";

export const useTranslateContext = <T extends TypeTranslateContextValue>(settings: T) => {
	const [contextState, setContextState] = useState<T & TranslateEditMode>({
		...settings,
		rerenderHelper: false,
		translateEditMode: localStorage.getItem("TranslateEditMode") === "true" ? true : false,
	});

	const userLanguageTemplate = settings.userLanguage || localStorage.getItem("userLang") || document.documentElement.lang
	const userLanguage = localStorage.getItem("userLang");
	if (!userLanguage) localStorage.setItem("userLang", userLanguageTemplate);
	const secondUserLanguageTemplate = settings.userLanguage || localStorage.getItem("userLang") || navigator.language;
	const secondUserLanguage = localStorage.getItem("secondUserLanguage");
	if (!secondUserLanguage) localStorage.setItem("secondUserLanguage", secondUserLanguageTemplate);

	const updateServerURL = (serverURL: string): void => {
		setContextState((prevState) => ({
			...prevState,
			serverURL,
		}));
	};

	const updateUserLanguage = (userLanguage: string): void => {
		localStorage.setItem("userLang", userLanguage);
		setContextState((prevState) => ({
			...prevState,
			userLanguage,
		}));
	};

	const switchUserLanguage = (): void => {
		const userLanguage = contextState.userLanguage || localStorage.getItem("userLang") || navigator.language;
		const secondUserLanguage = localStorage.getItem("secondUserLanguage") || secondUserLanguageTemplate;

		updateUserLanguage(secondUserLanguage);
		localStorage.setItem("secondUserLanguage", userLanguage);
		localStorage.setItem("userLang", secondUserLanguage);
	};

	const updateSiteLanguage = (siteLanguage: string): void => {
		localStorage.setItem("siteLang", siteLanguage);
		setContextState((prevState) => ({
			...prevState,
			siteLanguage,
		}));
	};

	const updateAutoGoogleTranslate = (autoGoogleTranslate: boolean): void => {
		setContextState((prevState) => ({
			...prevState,
			autoGoogleTranslate,
		}));
	};

	const updateTranslateEditMode = (translateEditMode: boolean): void => {
		setContextState((prevState) => ({
			...prevState,
			translateEditMode,
		}));
	};

	const rerenderHelperRevers =()=>{
		setContextState((prevState) => ({
			...prevState,
			rerenderHelper: !contextState.rerenderHelper,
		}));
	}

	return {
		settings: contextState,
		updateServerURL,
		updateUserLanguage,
		updateSiteLanguage,
		updateAutoGoogleTranslate,
		updateTranslateEditMode,
		switchUserLanguage,
		rerenderHelperRevers
	};
};
