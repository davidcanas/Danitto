import { Schema, model, Document } from "mongoose";

interface cmds extends Document {
  name: string;
  description: string;
  category: string;
  aliases: Array<string>;
}

const cmds: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    aliases: {
      type: Array,
    },
  },
  {
    versionKey: false,
  }
);

export default model<cmds>("cmds", cmds);
