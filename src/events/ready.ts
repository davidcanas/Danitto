import Client from "../structures/Client";

export default class ready {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run() {
    const activities = [
      "Usa /help para teres ajuda ",
      `Já estou em ${this.client.guilds.size} servidores!`,
      "danitto.live",
      `😃 Já Conheço ${this.client.users.size} usuários ! `,
    ];
    
    let i = 0;
    setInterval(async () => {
     this.client.editStatus("online", [{
        name: `${activities[i++ % activities.length]}`,
        type: 2,
      }]);
    }, 15000);

    console.log(`O client foi conectado com sucesso`);

    this.client.updateSlash();
    this.client.connectLavaLink();
    this.client.checkReminders();
  }
}
