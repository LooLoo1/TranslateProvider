import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { TranslateProvider } from "./context/TranslateContext.tsx";
import { TypeTranslateContextValue } from "./components/TranslateProvider/index.tsx";
import "./index.css";

const TranslateContextValue: TypeTranslateContextValue = {
	serverURL: "http://localhost:4000/translate",
	// userLanguage: "ua",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<TranslateProvider settings={TranslateContextValue}>
		<App />
	</TranslateProvider>,
);
