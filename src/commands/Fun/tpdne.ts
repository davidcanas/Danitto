import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class ThisPersonDoesNotExist extends Command {
  constructor(client: Client) {
    super(client, {
      name: "tpdne",
      description: "This Person Doesn't exists,Uma IA que gera uma pessoa que realmente não existe!",
      category: "Fun",
      aliases: ["thispersondoesnotexist", "estapessoanaoexiste", "epne"],
      options: [],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
   const numeroID = Math.floor(Math.random() * 1000);
    const embed = new this.client.embed()
      .setTitle("🧑🏻 Esta pessoa não existe")
      .setImage(`https://thispersondoesnotexist.com/image?id=${numeroID}`)
      .setColor("RANDOM")
    ctx.sendMessage({ embed })
   


  }
}
