import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class Help extends Command {
  constructor(client: Client) {
    super(client, {
      name: "help",
      description: "Vê os comandos do danitto",
      category: "Info",
      aliases: ["ajuda", "comandos", "cmds", "cmd"],
      options: [
        {
          name: "comando",
          type: 3,
          description: "Caso tenha duvida de algum comando use este parametro.",
          required: false,
        },
      ], //lol
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    const Info = [];
    const Util = [];
    const Fun = [];
    const Owner = [];
    const Music = [];
    const args = ctx.args[0];

    if (!args) {
      this.client.commands.map((cmd) => {
        if (cmd.category === "Info") Info.push(cmd.name);
        else if (cmd.category === "Fun") Fun.push(cmd.name);
        else if (cmd.category === "Util") Util.push(cmd.name);
        else if (cmd.category === "Owner") Owner.push(cmd.name);
        else if (cmd.category === "Music") Music.push(cmd.name);
      });
      const help = new this.client.embed()
        .setTitle("Central de Ajuda Danitto")
        .setDescription(
          `<:terminal:830124045701087252> Ao todo tenho ${
            this.client.commands.length - Owner.length
          } comandos!`
        )
        //.setImage("https://i.imgur.com/nJekMMr.jpg")
        .setImage("https://i.imgur.com/aCGhlv1.png")
        .setFooter("Usa d/help <comando> para mais ajuda!")
        .setColor("RANDOM");
      if (Info.length !== 0) {
        help.addField(
          `**:information_source: Informação [${Info.length}]**`,
          `\`\`\`${Info.join(" - ")}\`\`\``
        );
      }
      if (Util.length !== 0) {
        help.addField(
          `:bulb: Utilidades [${Util.length}]`,
          `\`\`\`${Util.join(" - ")}\`\`\``
        );
      }
      if (Fun.length !== 0) {
        help.addField(
          `:tada: Diversão [${Fun.length}]`,
          `\`\`\`${Fun.join(" - ")}\`\`\``
        );
      }
      if (Music.length !== 0) {
        help.addField(
          `🎵 Música [${Music.length}]`,
          `\`\`\`${Music.join(" - ")}\`\`\``
        );
      }
      ctx.sendMessage({
        embeds: [help],
        content: "",
      });
    } else {
      const command =
        this.client.commands.find((c) => c.name === args) ||
        this.client.commands.find((c) => c.aliases && c.aliases.includes(args));
      if (!command) {
        return ctx.errorEmbed(`O comando ${args} não existe!`);
      }
      const helpCommand = new this.client.embed()
        .setTitle("Ajuda")
        .addField("Nome:", command.name)
        .addField("Descrição:", command.description)
        .addField("Categoria:", command.category)
        .addField("Aliases:", command.aliases.join(",") || "Sem aliases")
        .setColor("RANDOM");
      ctx.sendMessage({ embeds: [helpCommand], content: "" });
    }
  }
}
