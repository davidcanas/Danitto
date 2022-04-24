import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class Npm extends Command {
    constructor(client: Client) {
        super(client, {
            name: "npm",
            description: "Procura algo nos registros da npm",
            category: "Util",
            aliases: [],
            options: [{
                name: "package",
                type: 3,
                description: "O package a procurar nos registros...",
                required: true,
            },],
        });
    }

    async execute(ctx: CommandContext): Promise<void> {
        const packagE = ctx.args.join(" ").toLowerCase()
        const results = await this.client.fetch(`https://registry.npmjs.org/${packagE}`).then(a => a.json())
        if (results.error) {
            ctx.sendMessage(`:x: Eu não encontrei o package \`${packagE}\` nos registros do npm.`)
        }

        const embed = new this.client.embed()
        embed.setTitle(`📦 ${results.name}`)
        embed.addField(`➤ Descrição`, results.description)
        embed.addField(`➤ Tags`, "`" + results.keywords.join(",") + "`")
        embed.addField(`➤ Autor`, results.author.name)
        embed.addField(`➤ Versão`, results["dist-tags"].latest)
        embed.addField(`➤ Link`, `https://www.npmjs.com/package/${results.name}`)
        embed.setColor("RANDOM")
        embed.setFooter(ctx.author.username + "#" + ctx.author.discriminator, ctx.author.dynamicAvatarURL())
      ctx.sendMessage({embed})
    }
}