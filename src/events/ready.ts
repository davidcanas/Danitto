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
      "danitto.live",
      `😃 Já Conheço ${this.client.users.size} usuários ! `,
      "Se eu tiver um status como este significa que eu estou online, caso contrário estou offline",
    ];
    let i = 0;
    setInterval(async () => {
      this.client.editStatus("online", {
        name: `${activities[i++ % activities.length]}`,
        type: 0,
      });
    }, 15000);
    console.log(`O client foi conectado com sucesso`);
    this.client.connectLavaLink();
    this.client.checkReminders();
  }
}
