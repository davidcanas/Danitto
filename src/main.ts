import dotenv from "dotenv";
import DaniClient from "./structures/Client";
import database from "mongoose";
dotenv.config();

process.on("uncaughtException", (error) => {
  console.error(error);
});

process.on("unhandledRejection", (error) => {
  console.error(error);
});
database
  .connect(process.env.MONGODB as string)
  .then(() => console.log(`A database foi iniciada com sucesso`));
const client = new DaniClient(process.env.DANITOKEN);

client.loadEvents();
setTimeout(() => {
  client.loadCommands();
}, 1000);
client.connect();
export default client;
