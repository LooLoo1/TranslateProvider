import axios, { AxiosResponse } from 'axios';

export type TranslationParams = Record<string, string>;

export const getTranslate = async (url: string, params: TranslationParams): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};