import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class geoip extends Command {
  constructor(client: Client) {
    super(client, {
      name: "geoip",
      description: "Vê a localização de um ip específico!",
      category: "Util",
      aliases: ["ip", "infoip", "ipinfo"],
      options: [
        {
          name: "ip",
          type: 3,
          description: "O ip a procurar.",
          required: false,
        },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    const ip = ctx.args[0];
    if (!ip) {
      ctx.sendMessage("Você precisa de um ip para procurar!");
      return;
    }
    const dadosIP = await this.client.fetch(
      `http://ip-api.com/json/${ip
        .replaceAll("https://", "")
        .replaceAll("http://", "")
        .split(":")[0]
        .replace("undefined", "")
        .replace(undefined, "")}`
    );

    const embed = new this.client.embed();
    const dados = await dadosIP.json();
    if (dados.city === undefined) {
      ctx.sendMessage("O ip não foi encontrado!");
      return;
    }
    embed.setTitle(`Informações do IP`);
    embed.setDescription(`
        **IP:** ${dados.query}\n**País:** ${dados.country} (${dados.countryCode})\n**Distrito:** ${dados.regionName}\n**Cidade:** ${dados.city}\n**Código Postal**: ${dados.zip}\n**Empresa:** ${dados.isp}
        `);
    embed.setColor("RANDOM");
    embed.setFooter(`Latitude: ${dados.lat} | Longitude: ${dados.lon}`);
    ctx.sendMessage({ content: "", embeds: [embed] });
  }
}
