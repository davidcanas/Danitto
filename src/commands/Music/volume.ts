import Command from "../../structures/Command"
import Client from "../../structures/Client"
import CommandContext from "../../structures/CommandContext"
import { Player, ConnectionState } from 'vulkava';
import { VoiceChannel } from "eris";

export default class Volume extends Command {
    constructor(client: Client) {
        super(client, {
            name: "volume",
            description: "Seta o volume da musica",
            category: "Music",
            aliases: ["vol"],
            options: [ {
                name: 'volume',
                type: 3,
                description: 'O volume a setar.',
                required: true
            }] //lol

        })
    }

    async execute(ctx: CommandContext): Promise<void> {
        if (ctx.channel.type !== 0 || !ctx.guild) return;

        const currPlayer = this.client.music.players.get(ctx.guild.id as string);
        const voiceChannelID = ctx.member?.voiceState.channelID;
        const volume = Number(ctx.args[0])
        if (!voiceChannelID || (voiceChannelID && voiceChannelID !== currPlayer.voiceChannelId)) {
            ctx.sendMessage({ content: 'precisas tar no msm canal de voz q eu!', flags: 1 << 6 });
            return;
        }
        if (!currPlayer || currPlayer.state === ConnectionState.DISCONNECTED) {
            ctx.sendMessage('Não estou tocando nada.');
            return
        }
        if (isNaN(volume) || volume < 0 || volume > 500) {
            ctx.sendMessage("O Volume tem que ser um numero entre 0 e 500");
            return
        }

       

        currPlayer.filters.setVolume(volume)
        ctx.sendMessage(`**${ctx.author.username}#${ctx.author.discriminator}** alterou o volume para **${volume}/500**!`);
    }
}
