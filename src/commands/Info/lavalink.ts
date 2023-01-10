import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class LavalinkInfo extends Command {
  constructor(client: Client) {
    super(client, {
      name: "lavalink",
      description: "Vê as informações do meu lavalink",
      category: "Info",
      aliases: ["lavalinkinfo", "musicstats", "nodestats"],
      options: [],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    try {
      const node = this.client.music.nodes[0];
      if (!node) {
        ctx.sendMessage({
          content: "Não há nodes conectados no momento.",
          flags: 1 << 6,
        });
      }

      const embed = new this.client.embed()
        .setTitle("ℹ️ Informação do Lavalink")
        .setDescription(
          "`O que eu uso para tocar musica`:\n\n<:lava:862345050667089950> [Lavalink](https://github.com/davidffa/lavalink/releases) | <:vulkava:988120208734552124> [Vulkava](https://vulkava.js.org)"
        )
        .addField("<:identy:864509103431090217> Node", `\`${node.identifier}\``)
        .addField(":ping_pong: Ping", `\`${await node.ping()}ms\``)
        .addField("💿 Players", `\`${node.stats.players}\``)
        .addField("⏰  Uptime", `\`${ctx.MsToDate(node.stats.uptime)}\``)
        .addField(
          "<:cpu:864523602145706024> CPU",
          `Cores: \`${node.stats.cpu.cores}\`\nLavalink: \`${~~(
            node.stats.cpu.lavalinkLoad * 100
          )}%\`\nSistema: \`${~~(node.stats.cpu.systemLoad * 100)}%\``
        )
        .addField(
          "<:ram1:864523884442550333> RAM",
          `\`${(node.stats.memory.used / 1024 / 1024).toFixed(0)}MB\``
        )
        .addField(
          ":information_source: Versões",
          `Lavaplayer: \`${node.versions!.LAVAPLAYER}\` | Java: \`${
            node.versions!.JVM
          }\`\nKotlin: \`${node.versions!.KOTLIN}\` | Spring: \`${
            node.versions!.SPRING
          }\`\nBuild: \`${
            node.versions!.BUILD
          }\` | Buildado em: <t:${Math.floor(
            node.versions!.BUILDTIME / 1000
          )}:d>`
        )
        .setTimestamp()
        .setColor("RANDOM");

      ctx.sendMessage({ embeds: [embed] });
    } catch (err) {
      ctx.sendMessage({ content: `Ocorreu um erro: ${err}`, flags: 1 << 6 });
    }
  }
}
