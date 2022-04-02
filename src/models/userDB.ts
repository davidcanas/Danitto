import { Schema, model, Document } from "mongoose"
interface Profile {
    badges: Array<string>;
    sobremim: string;
    money: number;
}

interface userDB extends Document {
    _id: string;
    profile: Profile;
    blacklist: boolean;

}

const userDB: Schema = new Schema({
    _id: String,
    profile: {
        badges: {
            type: Array,
            default: [""]
        },
        sobremim: {
            type: String,
            default: "Danitto é lindo, use d/sobremim para editar esta mensagem."
        },
        money: {
            type: Number,
            default: 10
        }

    },
    blacklist: {
       type: Boolean,
       default: false
    }
}, {
    versionKey: false
})

export default model<userDB>("users", userDB)
