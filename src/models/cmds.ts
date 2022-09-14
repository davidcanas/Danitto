import { Schema, model, Document } from "mongoose";

interface cmds extends Document {
  name: string;
  description: string;
  category: string;
  aliases: Array<string>;
  uses: number;
  disabled: boolean;
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
    uses: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

export default model<cmds>("cmds", cmds);
