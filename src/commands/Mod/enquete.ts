import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class Enquete extends Command {
  constructor(client: Client) {
    super(client, {
      name: "enquete",
      description: "Cria uma enquete no servidor",
      category: "Mod",
      aliases: ["poll", "votação"],
      options: [
        {
          name: "mensagem_enquete",
          type: 3,
          description:
            "A mensagem da enquete (ex: Ativar dinamite na Finlândia)",
          required: true,
        },
        {
          name: "canal_enquete",
          type: 7,
          description:
            "O canal a publicar a enquete (deixe vazio para ser o atual).",
          required: false,
        },
      ], //lol
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    if (ctx.channel.type !== 0 || !ctx.guild) return;
    let ch;
    if (ctx.type === 0) {
      if (!ctx.channelMentions[0]) {
        ch = ctx.channel.id;
      } else {
        ch = ctx.channelMentions[0];
      }
    } else if (ctx.type === 1) {
      if (!ctx.args[1]) {
        ch = ctx.channel.id;
      } else {
        ch = ctx.args[1];
      }
    }
    ch = ctx.guild.channels.get(ch);
    if (ch.type !== 0) {
      ctx.sendMessage({
        content:
          "Isso não é um canal de texto, certifica-te que não estás a selecionar uma Categoria/Canal de voz",
        flags: 1 << 6,
      });
      return;
    }

    const embed = new this.client.embed()
      .setTitle("Enquete")
      .setDescription("**" + ctx.args[0] + "**")
      .setColor("RANDOM")
      .setFooter(
        `Enquete criada por ${ctx.author.username}#${ctx.author.discriminator}`
      );
    const message = await ch.createMessage({ embeds: [embed] });
    message.addReaction("✅");
    message.addReaction("❌");
    ctx.sendMessage({
      content: `Enquete criada com sucesso no canal <#${ch.id}>!`,
      flags: 1 << 6,
    });
  }
}
