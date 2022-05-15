import { Schema, model, Document } from "mongoose";

interface reminderDB extends Document {
    when: string,
    text: string,
    guildID: string,
    channelID: string
}

const reminderDB: Schema = new Schema(
    {
        id: {
            type: Number,
            required: true
        },
        when: {
            type: String
        },
        text: {
            type: String,
            default: "Sem conteudo"
        },
        guildID: {
        type: String
        },
        channelID: {
            type: String
        }
    },
    {
        versionKey: false,
    }
);

export default model<reminderDB>("reminder", reminderDB);
