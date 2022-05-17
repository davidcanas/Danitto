import { green, yellow } from "chalk";
import Client from "../structures/Client";

export default class ready {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run() {
    const activities = [
      "Utiliza d/help para obter ajuda ",
      `Estou em ${this.client.guilds.size} servidores!`,
      " Versão 4.7",
      `😃 Já Conheço ${this.client.users.size} usuários ! `,
      "#ForçaUcrânia!",
    ];
    let i = 0;
    setInterval(async () => {
      this.client.editStatus("online", {
        name: `${activities[i++ % activities.length]}`,
        type: 0,
      });
    }, 15000);
    console.log(`O ${yellow("client")} foi conectado com ${green("sucesso")}`);
    this.client.connectLavaLink();
    setTimeout(() => this.client.checkReminders(), 60000);
  }
}
