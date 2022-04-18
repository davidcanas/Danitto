import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class Help extends Command {
    constructor(client: Client) {
        super(client, {
            name: "avatar",
            description: "Vê o avatar de algum usuario.",
            category: "Info",
            aliases: ["av"],
            options: [
                {
                    name: "usuario",
                    type: 3,
                    description: "Caso queiras ver o avatar de um usuario diferente.",
                    required: false,
                },
            ],
        });
    }

    async execute(ctx: CommandContext): Promise<void> {
        let user;

        if (ctx.args[0]) {
            user = await this.client.findUser(ctx.args.join(" "), ctx.guild);
        } else {
            user = ctx.author;
        }

        const embed = new this.client.embed();
        embed.setTitle(`Avatar de ${this.client.users.get(user.id).username}`);
        embed.setDescription(`[Transfere o avatar aqui](${this.client.users.get(user.id).dynamicAvatarURL()})`);
        embed.setImage(this.client.users.get(user.id).avatarURL);
        embed.setColor("RANDOM");
        embed.setFooter("Danitto © Todos os direitos reservados.");


    }
}