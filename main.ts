import dotenv from "dotenv";
import DaniClient from "./src/structures/Client";
import database from "mongoose";
import { green, yellow } from "chalk";
dotenv.config();


process.on("uncaughtException", (lolError) => {
  console.error(lolError);
});

process.on("unhandledRejection", (lolError) => {
  console.error(lolError);
});
database
  .connect(process.env.MONGODB as string)
  .then(() =>
    console.log(`A ${yellow("database")} foi iniciada com ${green("sucesso")}`)
  );
const client = new DaniClient(process.env.DANITOKEN);

client.loadEvents();
setTimeout(() => {
  client.loadCommands();
}, 1000);
client.connect();
export default client;
