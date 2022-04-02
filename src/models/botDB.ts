import { Schema, model, Document } from "mongoose"

interface botDB extends Document {
	botID: string;
	commands: number;
	manu: boolean;

}

const botDB: Schema = new Schema({
	botID: {
		required: true,
		type: String
	},
	commands: {
		type: Number,
		default: 0
	},
	manu: {
		type: Boolean,
		default: false
	},
}, {
	versionKey: false
})

export default model<botDB>("Bot", botDB)