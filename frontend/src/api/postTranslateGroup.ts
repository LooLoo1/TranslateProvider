import axios, { AxiosResponse } from "axios";
import { TranslationItem } from "../hooks/useGroupedTranslation";

export type TranslationParams = Record<string, string>;
export type TranslationObj = Record<string, TranslationItem>;
export type TranslationObjPost = Record<string, Record<string, TranslationItem>>

export const postTranslateGroup = async (url: string, obj: TranslationObjPost, params: TranslationParams): Promise<any> => {
	try {
		const response: AxiosResponse = await axios.post(url, obj, { params });
		return response.data;
	} catch (error) {
		console.error("Error post data:", error);
		return null;
	}
};
