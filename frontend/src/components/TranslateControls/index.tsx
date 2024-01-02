import { ReactNode, useContext, useEffect, useRef } from "react";
import countries from "world-countries";
import { useDraggable } from "../../hooks/useDraggable";
import { useGroupedTranslation } from "../../hooks/useGroupedTranslation";
import { TranslateContext } from "../TranslateProvider";

type TranslateControls = {
	children: ReactNode;
};

export const TranslateControls = ({ children }: TranslateControls) => {
	//TODO Тут демонстраційні компоненти вибору мови і перекладу

	// Книпки сейв ресет, весь список раїн, процентаж всіх на сторінці перекладених

	// react-country-flag - npm
	// https://www.npmjs.com/package/react-world-flags

	const {
		settings: { translateEditMode, userLanguage, rerenderHelper },
		updateUserLanguage,
		rerenderHelperRevers,
	} = useContext(TranslateContext);
	const { resetGroup, serverPush, serverPushPage, resetGroupPage, calculateChangedItemsPercentage } =
		useGroupedTranslation();
	const lang = userLanguage || localStorage.getItem("userLang") || navigator.language;

	const removeAll = () => {
		resetGroup();
		rerenderHelperRevers();
	};

	const removeItemsByURL = () => {
		resetGroupPage(window.location.href, lang);
		rerenderHelperRevers();
	};
	const getFilteredJSONByURL = () => {
		serverPushPage(window.location.href, lang);
		rerenderHelperRevers();
	};
	const saveAll = () => {
		serverPush();
		rerenderHelperRevers();
	};

	const [ref, handleMouseDown, draggableStyles] = useDraggable({ top: 20, left: 20 });
	const [buttonsRef, buttonsHandleMouseDown, buttonsDraggableStyles] = useDraggable({ bottom: 20, right: 20 });
	const [selectRef, selectHandleMouseDown, selectDraggableStyles] = useDraggable({ top: 20, right: 20 });

	const percentRef = useRef<HTMLSpanElement | null>(null);

	useEffect(() => {
		if (percentRef.current) {
			percentRef.current.innerText = String(calculateChangedItemsPercentage(lang).toFixed(2)) + "%";
		}
	}, [rerenderHelper]);

	const countriesList = countries.map(({ cca2, name }) => ({ label: name.common, value: cca2.toLowerCase() }));

	return (
		<>
			{translateEditMode && (
				<>
					<div ref={ref} style={draggableStyles} onMouseDown={handleMouseDown}>
						Future progres bar with <span ref={percentRef}>0%</span>
					</div>
					<div
						ref={buttonsRef}
						style={{ ...buttonsDraggableStyles, display: "flex" }}
						onMouseDown={buttonsHandleMouseDown}
					>
						<button onClick={saveAll}>Save</button>
						<button onClick={removeAll}>Reset</button>

						<button onClick={getFilteredJSONByURL}>Save the page</button>
						<button onClick={removeItemsByURL}>Reset the page</button>
					</div>

					<div ref={selectRef} style={selectDraggableStyles} onMouseDown={selectHandleMouseDown}>
						<select
							value={userLanguage}
							onChange={(e) => {
								updateUserLanguage(e.target.value);
								rerenderHelperRevers()
							}}
						>
							{countriesList.map((country) => (
								<option key={country.value} value={country.value}>
									{country.label}
								</option>
							))}
						</select>
					</div>
				</>
			)}
			{children}
		</>
	);
};
