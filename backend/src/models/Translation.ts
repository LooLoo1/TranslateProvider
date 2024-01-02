import { Document, Model, Schema, model } from "mongoose";

interface ITranslation extends Document {
	key: string;
	translations: Map<string, {
		text: string,
		translateUserId: string,
		updatedAt: number,
		locationURL: string
	}>;
}

const translationSchema: Schema<ITranslation> = new Schema({
	key: String,
	translations: {
		type: Map,
		of: new Schema({
			text: {
				type: String,
				required: true
			},
			updatedAt: Number,
			locationURL: String,
			translateUserId: String
		})
	},
});

export const Translation: Model<ITranslation> = model<ITranslation>("Translation", translationSchema);

// import { Document, Model, Schema, model } from "mongoose";

// interface ITranslation extends Document {
// 	key: string;
// 	translations: Map<string, string>;
// }

// const translationSchema: Schema<ITranslation> = new Schema({
// 	key: String,
// 	translations: {
// 		type: Map,
// 		of: String,
// 	},
// });

// export const Translation: Model<ITranslation> = model<ITranslation>("Translation", translationSchema);


