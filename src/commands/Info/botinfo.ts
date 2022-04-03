import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import os1 from "node-os-utils";
export default class Botinfo extends Command {
  constructor(client: Client) {
    super(client, {
      name: "botinfo",
      description: "Informações sobre o Danitto",
      category: "Info",
      aliases: ["bi"],
      options: [],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    try {
      const cpuValor = await os1.cpu.usage();
      const cmd = this.client.commands.length;
      const cmdExec = await this.client.db.bot.findOne({
        botID: this.client.user.id,
      });
      const serv = this.client.guilds.size;
      const nome = `${this.client.user.username}#${this.client.user.discriminator}`;
      const dono = this.client.users.get("733963304610824252");

      const embed = new this.client.embed()
        .setTitle("<:danitto:883308546983362561> Informações do Danitto")
        .setDescription(`Comandos executados: \`${cmdExec.commands}\``)
        .addField("<:identy:864509103431090217> Nome", `${nome}`)
        .addField("📆 Criado em", `<t:1592463600:D> (<t:1592463600:R>)`)
        .addField(
          "<:d_:793559827543752735> Dono",
          `${dono?.username}#${dono?.discriminator}`
        )
        .addField("<:discord:864509377256095764> Servidores", `${serv}`)
        .addField(
          "<:nodejs:864509809595646003> Versão do Node",
          process.version
        )
        .addField("<:pasta:793559362093711440> Comandos", `${cmd}`)
        .addField("📚 Biblioteca", "Eris")
        .addField(
          "<:relogio:862344276028555264> Estou acordado á ",
          `${ctx.MsToDate(this.client.uptime)}`
        )
        .addField("<:cpu:864523602145706024> CPU", cpuValor + "%")
        .addField(
          "<:ram1:864523884442550333> RAM",
          `${(process.memoryUsage().rss / 1024 / 1024).toFixed(0)}MB`
        )
        .setColor("RANDOM");
      ctx.sendMessage({
        embeds: [embed],
      });
    } catch (err) {
      ctx.sendMessage({
        content: `Ups... ocorreu um erro inesperado ao tentar executar este comando... ${err}`,
        flags: 1 << 6,
      });
    }
  }
}
