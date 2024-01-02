import React from "react";
import { TranslateContextProvider, TypeTranslateContextValue } from "../components/TranslateProvider";
import { TranslateContextValueTemplate } from "../constants/TranslateConstants";

type TranslateProviderProps = {
	children: React.ReactNode;
	settings: TypeTranslateContextValue;
};

export const TranslateProvider = ({ children, settings }: TranslateProviderProps) => {
	settings = { ...TranslateContextValueTemplate, ...settings };

	return <TranslateContextProvider settings={settings}>{children}</TranslateContextProvider>;
};
