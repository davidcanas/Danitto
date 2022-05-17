import { Schema, model, Document } from "mongoose";

interface reminderDB extends Document {
  when: string;
  text: string;
  userID: string;
}

const reminderDB: Schema = new Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    when: {
      type: String,
    },
    text: {
      type: String,
      default: "Sem conteudo",
    },
    userID: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

export default model<reminderDB>("reminder", reminderDB);
