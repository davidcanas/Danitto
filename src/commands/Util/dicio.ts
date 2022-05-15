import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class Dicio extends Command {
  constructor(client: Client) {
    super(client, {
      name: "dicio",
      description: "Vê o significado de uma palavra",
      category: "Util",
      aliases: ["dicionario", "significado"],
      options: [
        {
          name: "palavra",
          type: 3,
          description: "A palavra a procurar...",
          required: true,
        },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    const palavra = ctx.args.join(" ");
    const embed = await this.client
      .fetch(`https://api.danitto.live/dicio/${palavra}`)
      .then((a) => a.json());

    ctx.sendMessage({ embed });
  }
}
