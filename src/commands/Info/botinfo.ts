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
      let mostUsed = await this.client.db.cmds.find({});
      mostUsed = mostUsed.sort((a, b) => b.uses - a.uses);
      const cpuValor = await os1.cpu.usage();
      const cmd = this.client.commands.length;
      const cmdExec = await this.client.db.bot.findOne({
        botID: this.client.user.id,
      });
      const serv = this.client.guilds.size;
      const nome = `${this.client.user.username}#${this.client.user.discriminator}`;
      const dono = this.client.users.get("733963304610824252");

      const embed = new this.client.embed()
        .setTitle("<:danitto:972020988663439390> Minhas informações")
        .setDescription(
          `Comandos executados: \`${cmdExec.commands}\`\nComando mais usado: \`${mostUsed[0].name}\` (\`${mostUsed[0].uses}\` vezes usado)`
        )
        .addField("<:identy:864509103431090217> Nome", `${nome}`, true)
        .addField("📆 Criado em", `<t:1592463600:D> (<t:1592463600:R>)`, true)
        .addField(
          "<:d_:793559827543752735> Dono",
          `${dono?.username}#${dono?.discriminator}`,
          true
        )
        .addField("<:discord:864509377256095764> Servidores", `${serv}`, true)
        .addField(
          "<:nodejs:864509809595646003> Versão do Node",
          process.version,
          true
        )
        .addField("<:pasta:793559362093711440> Comandos", `${cmd}`, true)
        .addField("📚 Biblioteca", "OceanicJS", true)
        .addField(
          "<:relogio:862344276028555264> Estou acordado á ",
          `${ctx.MsToDate(this.client.uptime)}`,
          true
        )
        .addField("<:cpu:864523602145706024> CPU", cpuValor + "%", true)
        .addField(
          "<:ram1:864523884442550333> RAM",
          `${(process.memoryUsage().rss / 1024 / 1024).toFixed(0)}MB`,
          true
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
