
import dotenv from "dotenv"
import DaniClient from "./src/structures/Client"
import database from "mongoose"
import { green, yellow } from "chalk"
dotenv.config()
let token;
if (process.env.DEVELOPMENT === "false") {
    token = process.env.DANITOKEN
    console.log(green("[Sistema] Iniciando no modo normal"))
} else {
    token = process.env.DANITOKEN2
    console.log(yellow("[Sistema] Iniciando no modo de desenvolvimento"))
}

const client = new DaniClient(token)

process.on('uncaughtException', (lolError) => {
    console.error(lolError);
});

process.on('unhandledRejection', (lolError) => {
    console.error(lolError);
});
database.connect(process.env.MONGODB as string).then(() => console.log(`A ${yellow("database")} foi iniciada com ${green("sucesso")}`))


client.loadEvents()
setTimeout(() => {
    client.loadCommands()
}, 5000);
client.connect()
export default client
