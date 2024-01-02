import { MD5 } from "crypto-js";
import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useGroupedTranslation } from "../../hooks/useGroupedTranslation";
import { useTranslationCache } from "../../hooks/useTranslationCache";
import { TranslateContext } from "../TranslateProvider";

type TranslateProps<T extends keyof JSX.IntrinsicElements> = {
	children: string;
	style?: React.CSSProperties;
} & React.ComponentPropsWithoutRef<T>;

type HTMLTags = Record<string, React.ElementType<TranslateProps<any>>>;

const Component = <T extends keyof JSX.IntrinsicElements>(tag: T | symbol | string) => {
	const {
		settings: { translateEditMode, userLanguage, rerenderHelper },
	} = useContext(TranslateContext);

	const elementRef = useRef<HTMLElement>(null);
	const originalText = useRef<string | null>(null);
	const keyRef = useRef<string | null>(null);
	const styleRef = useRef<{ color: string; backgroundColor: string; mixBlendMode: string; border: string } | null>(
		null,
	);
	const isTextChanged = useRef<boolean>(false);
	const { updateGroupTranslation, GroupedTranslationContainer } = useGroupedTranslation();
	const { getTranslation, setKey } = useTranslationCache();

	const styleUpdate = () => {
		const element = elementRef.current;
		if (element && styleRef.current) {
			const CSS = element.style;
			const { color, backgroundColor, mixBlendMode, border } = styleRef.current;
			CSS.color = translateEditMode ? "white" : color || "";
			CSS.backgroundColor = translateEditMode ? "black" : backgroundColor || "";
			CSS.mixBlendMode = translateEditMode ? "difference" : mixBlendMode || "normal";
			CSS.border = translateEditMode ? (isTextChanged.current ? "4px solid green" : "4px solid red") : border || "";
		}
	};

	// const styleUpdate = () => {
	// 	const element = elementRef.current;
	// 	if (element ) {
	// 		const CSS = element.style;
	// 		CSS.color = translateEditMode ? "white" : "";
	// 		CSS.backgroundColor = translateEditMode ? "black" : "";
	// 		CSS.mixBlendMode = translateEditMode ? "difference" : "normal";
	// 		CSS.border = translateEditMode ? (isTextChanged.current ? "4px solid green" : "4px solid red") : "";
	// 	}
	// };

	useEffect(() => {
		const element = elementRef.current;
		if (element) {
			const { color, backgroundColor, mixBlendMode, border } = element.style;
			styleRef.current = {
				color,
				backgroundColor,
				mixBlendMode,
				border,
			};
		}
	}, [elementRef]);

	const handleInputChange = useCallback(
		(event: React.FormEvent<HTMLDivElement>) => {
			const newText = event.currentTarget.textContent;
			if (newText !== originalText.current) {
				isTextChanged.current = true;
			} else {
				isTextChanged.current = false;
			}
			styleUpdate();
		},
		[styleUpdate],
	);

	const handleInputBlur = useCallback(
		(event: React.FormEvent<HTMLDivElement>) => {
			const newText = event.currentTarget.textContent;

			if (newText && originalText.current && keyRef.current && newText !== originalText.current) {
				const key = keyRef.current;
				updateGroupTranslation(userLanguage || localStorage.getItem("userLang") || navigator.language, key, {
					text: newText,
					updatedAt: Date.now(),
					locationURL: window.location.href,
				});
			}

			styleUpdate();
		},
		[updateGroupTranslation, userLanguage, styleUpdate],
	);

	useEffect(() => {
		styleUpdate();
	}, [styleUpdate, rerenderHelper]);

	useEffect(() => {
		if (originalText.current) {
			keyRef.current = MD5(originalText.current).toString();
			setKey(keyRef.current, originalText.current);
		}
	}, [originalText, setKey]);

	useEffect(() => {
		if (originalText.current && keyRef.current && elementRef.current) {
			const editText = GroupedTranslationContainer.get(
				userLanguage || localStorage.getItem("userLang") || navigator.language,
			)?.get(keyRef.current)?.text;

			if (editText && translateEditMode) {
				isTextChanged.current = true;
				elementRef.current.innerText = editText;
			}

			if (editText && !translateEditMode) {
				elementRef.current.innerText = originalText.current;
			}

			if (!editText) {
				isTextChanged.current = false;
				elementRef.current.innerText = originalText.current;
				getTranslation(originalText.current).then((translation) => {
					if (elementRef.current) {
						elementRef.current.innerText = translation || originalText.current;
					}
				});
			}
			styleUpdate();
		}

	}, [translateEditMode, GroupedTranslationContainer, userLanguage, styleUpdate, elementRef, getTranslation]);

	return useMemo(
		() =>
			({ children, style, ...props }: TranslateProps<T>) => {
				originalText.current = children;
				const Tag = tag as keyof HTMLTags;

				return (
					<Tag
						{...props}
						style={{ ...style }}
						ref={elementRef}
						contentEditable={translateEditMode}
						onInput={handleInputChange}
						onBlur={handleInputBlur}
						data-translate
					></Tag>
				);
			},
		[tag, translateEditMode, handleInputChange, handleInputBlur],
	);
};

export const Translate: HTMLTags = new Proxy(
	{},
	{
		get(target, tag) {
			return Component(tag);
		},
	},
);
