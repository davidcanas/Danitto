import Command from "../../structures/Command"
import Client from "../../structures/Client"
import CommandContext from "../../structures/CommandContext"
import fetch from "node-fetch"
export default class erisdocsapi extends Command {
    constructor(client: Client) {
        super(client, {
            name: "geoip",
            description: "Vê a localização de um ip específico!",
            category: "Util",
            aliases: ["ip", "infoip", "ipinfo"],
            options: [{
                name: 'ip',
                type: 3,
                description: 'O ip a procurar.',
                required: false
            }]

        })
    }

    async execute(ctx: CommandContext): Promise<void> {
        const ip = ctx.args[0]
        if (!ip) {
            ctx.sendMessage("Você precisa de um ip para procurar!")
            return
        }
        const dadosIP = await fetch(`http://ip-api.com/json/${ip.replaceAll('https://', '').replaceAll('http://', '').split(':')[0].replace('undefined', '').replace(undefined, '')}`)


        const embed = new this.client.embed()
        const dados = await dadosIP.json()
        if (dados.city === undefined) {
            ctx.sendMessage('O ip não foi encontrado!')
            return
        }
        embed.setTitle(`Informações do IP`)
        embed.setDescription(`
        **IP:** ${dados.query}\n**Cidade:** ${dados.city}\n**Estado:** ${dados.regionName}\n**País:** ${dados.country}\n**Latitude:** ${dados.lat}\n**Longitude:** ${dados.lon}\n**Empresa:** ${dados.org}
        `)
        embed.setColor(0x00ff00)
        ctx.sendMessage({ content: "", embeds: [embed] })
    }
}