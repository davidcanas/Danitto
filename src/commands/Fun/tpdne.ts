import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class ThisPersonDoesNotExist extends Command {
  constructor(client: Client) {
    super(client, {
      name: "tpdne",
      description: "This Personm Doesn't exists - Uma IA que gera uma pessoa que realmente não existe!",
      category: "Fun",
      aliases: ["thispersondoesnotexist", "estapessoanaoexiste", "epne"],
      options: [],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
  
        const embed = new this.client.embed()
        .setTitle("🧑🏻 Esta pessoa não existe")
        .setImage("https://thispersondoesnotexist.com/image")
        .setColor("RANDOM")
        ctx.sendMessage({embed})
  


  }
}
