import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class Ping extends Command {
    constructor(client: Client) {
        super(client, {
            name: "ping",
            description: "Vê a minha latência",
            category: "Info",
            aliases: ["latência", "latency"],
            options: [],
        });
    }

    async execute(ctx: CommandContext): Promise<void> {
     
        const initDB = process.hrtime();
        
        await this.client.db.cmds.findOne({name: "ping"});
        
        const stopDB = process.hrtime(initDB);


        const embed = new this.client.embed();
        embed.setTitle("<:internet:797178541702774834> Minha latência");
        embed.setDescription(`🤖 ${this.client.shards.get(0).latency}ms\n<:lava:862345050667089950> ${await this.client.music.nodes[0].ping()}ms\n<:MongoDB:862343156854423552> ${Math.round(((stopDB[0] * 1e9) + stopDB[1]) / 1e6)}ms`);
        embed.setColor("RANDOM");

        ctx.sendMessage({embeds: [embed]});
    }}