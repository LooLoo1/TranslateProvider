import React, { createContext, memo, useState } from "react";
import { updateLocalStorage, useKeydownListener } from "../../hooks/useKeydownListener";
import { useStorageEventListener } from "../../hooks/useStorageEventListener";
import { TranslateControls } from "../TranslateControls";
import { useTranslateContext } from "../../hooks/useTranslateContext";
import { TranslateContextValueTemplate } from "../../constants/TranslateConstants";

export type TypeTranslateContextValue = {
	serverURL: string;
	userLanguage?: string;
	siteLanguage?: string;
	autoGoogleTranslate?: boolean;

	// autoTranslate?: 'google' | 'GPT-3.5' | 'GPT-4'
};

export type TranslateEditMode = {
	translateEditMode?: boolean;
	rerenderHelper?: boolean
};

type TranslateContextProviderValue = {
	settings: TypeTranslateContextValue & TranslateEditMode;
	updateServerURL: (serverURL: string) => void;
	updateUserLanguage: (userLanguage: string) => void;
	updateSiteLanguage: (siteLanguage: string) => void;
	updateAutoGoogleTranslate: (autoGoogleTranslate: boolean) => void;
	updateTranslateEditMode: (translateEditMode: boolean) => void;
	switchUserLanguage: () => void;
	rerenderHelperRevers:()=>void

};

type TranslateContextProviderProps = {
	children: React.ReactNode;
	settings: TypeTranslateContextValue;
};



export const TranslateContext = createContext<TranslateContextProviderValue>({
	settings: TranslateContextValueTemplate,
	updateServerURL: () => undefined,
	updateUserLanguage: () => undefined,
	updateSiteLanguage: () => undefined,
	updateAutoGoogleTranslate: () => undefined,
	updateTranslateEditMode: () => undefined,
	switchUserLanguage: () => undefined,
	rerenderHelperRevers: () => undefined
});



// TODO { children, settings } add boolean variable for if (event.ctrlKey) { update
export const TranslateContextProvider = memo(({ children, settings }: TranslateContextProviderProps) => {
	const {
		settings: contextState,
		updateServerURL,
		updateUserLanguage,
		updateSiteLanguage,
		updateAutoGoogleTranslate,
		updateTranslateEditMode,
		switchUserLanguage,
		rerenderHelperRevers
	} = useTranslateContext<TypeTranslateContextValue & TranslateEditMode>({
		...TranslateContextValueTemplate,
		...settings,
		rerenderHelper: false,
	});

	useKeydownListener("KeyE", (event: KeyboardEvent) => {
		if (event.ctrlKey) {
			// Треба попробувати передавати умову через пропси
			updateLocalStorage("TranslateEditMode", String(!contextState.translateEditMode));
			switchUserLanguage()
		}
	});

	useStorageEventListener("TranslateEditMode", (newValue) => {
		updateTranslateEditMode(newValue);
	});

	const contextValue: TranslateContextProviderValue & TranslateEditMode = {
		settings: contextState,
		updateServerURL,
		updateUserLanguage,
		updateSiteLanguage,
		updateAutoGoogleTranslate,
		updateTranslateEditMode,
		switchUserLanguage,
		rerenderHelperRevers
	};

	return (
		<TranslateContext.Provider value={contextValue}>
			<TranslateControls>{React.Children.only(children)}</TranslateControls>
		</TranslateContext.Provider>
	);
});
