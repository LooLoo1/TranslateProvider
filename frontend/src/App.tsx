import { memo } from "react";
import { Translate } from "./components/Translate";

export const App = memo(() => {
	return (
		<main>
			<Translate.h1>Test h1</Translate.h1>
			<Translate.p>Test text 1 p</Translate.p>
			<Translate.p>Test text 2 p</Translate.p>
			<Translate.p style={{backgroundColor: 'blue'}}>Test text 3 p</Translate.p>
			<Translate.p>Test text 4 p</Translate.p>
			<Translate.p>Test text 5 p</Translate.p>
			<Translate.p>Test text 6 p</Translate.p>
			<div>Test rerender</div>
		</main>
	);
});
