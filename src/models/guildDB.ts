import { Schema, model, Document } from "mongoose";

interface guildDB extends Document {
  guildID: string;
}

const guildDB: Schema = new Schema(
  {
    guildID: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model<guildDB>("guilds", guildDB);
