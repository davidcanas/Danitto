import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class Encurtar extends Command {
  constructor(client: Client) {
    super(client, {
      name: "encurtar",
      description: "Encurta um link.",
      category: "Util",
      aliases: ["dink", "shorturl", "encurtarURL"],
      options: [
        {
          name: "url",
          type: 3,
          description: "O link a encurtar...",
          required: true,
        },
        {
          name: "code",
          type: 3,
          description:
            "Caso queiras personalizar o código do url usa este campo [ex: servidor_do_john]",
          required: false,
        },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    let url;

    if (ctx.args[1]) {
      url = `https://dink.ga/api/criarURL?url=${ctx.args[0]}&code=${ctx.args[1]}`;
    } else {
      url = `https://dink.ga/api/criarURL?url=${ctx.args[0]}`;
    }
    const request = await this.client.fetch(url);

    const result = await request.json();
    console.log(result);

    if (result.erro) {
      ctx.sendMessage(`Ocorreu um erro a encurtar o URL\n\`${result.erro}\``);
    } else {
      ctx.sendMessage(
        `Pronto, encurtei o URL pedido, agora podes simplesmente aceder a https://dink.ga/${result.code}.`
      );
    }
  }
}
