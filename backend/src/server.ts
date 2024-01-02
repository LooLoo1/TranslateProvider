import express, { Express } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import translateRouter from "./routes/translate";
require("dotenv").config({ path: ".env.local" });

const app:Express = express();
app.use(express.json());
app.use(cors())

const DB_URL = process.env.DB_URL || "Error...";
// Connect to MongoDB
mongoose
	.connect(DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	} as ConnectOptions)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Failed to connect to MongoDB", error);
	});

// Use rout /translate
app.use("/translate", translateRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
