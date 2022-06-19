import Client from "../structures/Client";

export default class ready {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run() {
    const activities = [
      "Usa d/help para teres ajuda ",
      `Já estou em ${this.client.guilds.size} servidores!`,
      "Meu site: danitto.live",
      `😃 Já Conheço ${this.client.users.size} usuários ! `,
      "ℹ️ Se eu tiver um status como este significa que eu estou online, caso contrário estou offline",
    ];
    let i = 0;
    setInterval(async () => {
      this.client.editStatus("online", {
        name: `${activities[i++ % activities.length]}`,
        type: 0,
      });
    }, 15000);
    console.log(`O client foi conectado com sucesso`);
    this.client.updateSlash()
    this.client.connectLavaLink();
    this.client.checkReminders();
  }
}
