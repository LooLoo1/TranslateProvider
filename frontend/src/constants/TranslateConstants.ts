import { TypeTranslateContextValue } from "../components/TranslateProvider";

export const TranslateContextValueTemplate: TypeTranslateContextValue = {
	serverURL: "http://localhost:4000/translate",
	userLanguage: localStorage.getItem("userLang") || navigator.language,
	siteLanguage: document.documentElement.lang,
};