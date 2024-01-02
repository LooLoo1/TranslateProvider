// routes/translate.ts
import express, { Request, Response, Router } from "express";
import { Translation } from "../models/Translation";

const router: Router = express.Router();

// Request handler GET /translate
router.get("/", async (req: Request, res: Response) => {
	try {
		const { languageCode, translationKey, autoGoogleTranslate, autoTranslate } = req.query;

		if (!languageCode || typeof languageCode !== "string") {
			return res.status(400).json({ error: "Invalid language code" });
		}

		if (!translationKey || typeof translationKey !== "string") {
			return res.status(400).json({ error: "Invalid translation key" });
		}

		const translation = await Translation.findOne({ key: translationKey });

		if (!translation || !translation.translations.get(languageCode)) {
			// If translation for the specified language code doesn't exist, check if a 2-letter language code exists
			const shortenedLanguageCode = languageCode.substring(0, 2);
			if (translation && translation.translations.get(shortenedLanguageCode)) {
				const translatedText = translation.translations.get(shortenedLanguageCode)?.text;
				return res.status(200).json({
					translation: translatedText,
					correspondsLanguage: false,
					translationCode: shortenedLanguageCode,
				});
			} else {
				// TODO Translate

				return res.status(204).json({
					error: "Translation not found",
					correspondsLanguage: false,
					translationCode: translationKey,
					translation: translationKey,
				});
			}
		}

		const translateText = translation.translations.get(languageCode)?.text;

		return res.status(200).json({
			translation: translateText,
			correspondsLanguage: true,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Request handler POST /translate
router.post("/", async (req: Request, res: Response) => {
	try {
		if (!req.body) {
			return false;
		}

		const postObject = req.body;
		const countryKeys = Object.keys(req.body);

		countryKeys.forEach(async (countryCode) => {
			const textIds = Object.keys(postObject[countryCode]);
			textIds.forEach(async (textId) => {
				try {
					const translation = await Translation.findOne({ key: textId });

					if (translation) {
						// If translation with the given key exists, update the translations object
						const { text, updatedAt, locationURL, translateUserId } = postObject[countryCode][textId];
						translation.translations.set(countryCode, {
							text,
							updatedAt,
							locationURL,
							translateUserId,
						});

						await translation.save();
					}
					if (!translation) {
						// If translation with the given key doesn't exist, create a new translation object
						const { text, updatedAt, locationURL, translateUserId } = postObject[countryCode][textId];
						const newTranslation = new Translation({
							key: textId,
							translations: {
								[countryCode]: {
									text,
									updatedAt,
									locationURL,
									translateUserId,
								},
							},
						});

						await newTranslation.save();
					}
				} catch (error) {
					console.error(error);
				}
			});
		});
		return res.status(200).json({});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

export default router;

// if (autoGoogleTranslate === "true" || autoTranslate == "google") {
// 	const { originalText } = req.query;
// 	// const translatedText = await translate(originalText, { to: languageCode });

// 	const translatedText = await translate(String(originalText), { to: languageCode })
// 		.then((res: any) => {
// 			console.log(res.text);

// 			return res.text;
// 		})
// 		.catch((err: any) => {
// 			console.error(err);
// 		});

// 	return res.status(200).json({
// 		translation: translatedText,
// 		correspondsLanguage: false,
// 		autoTranslate: true,
// 	});
// }
