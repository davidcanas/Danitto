import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Player, ConnectionState, DefaultQueue } from "vulkava";
import { VoiceChannel } from "oceanic.js";

export default class Stop extends Command {
  constructor(client: Client) {
    super(client, {
      name: "shuffle",
      description: "Embaralha a lista de musicas ",
      category: "Music",
      aliases: ["randomizarqueue", "embaralhar"],
      options: [],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    if (ctx.channel.type !== 0 || !ctx.guild) return;

    const currPlayer = this.client.music.players.get(ctx.guild.id as string);
    const voiceChannelID = ctx.member?.voiceState.channelID;

    if (
      !voiceChannelID ||
      (voiceChannelID && voiceChannelID !== currPlayer.voiceChannelId)
    ) {
      ctx.sendMessage({
        content: "Precisas de estar no canal de voz onde eu estou!",
        flags: 1 << 6,
      });
      return;
    }
    if (!currPlayer || currPlayer.state === ConnectionState.DISCONNECTED) {
      ctx.sendMessage({ content: "Não estou a tocar nada.", flags: 1 << 6 });
      return;
    }
    if (!currPlayer.queue.size) {
      ctx.sendMessage({
        content:
          "A queue não tem mais músicas para além da que está a tocar neste momento!",
        flags: 1 << 6,
      });
      return;
    }

    (currPlayer.queue as DefaultQueue).shuffle();

    ctx.sendMessage(":star: Lista de músicas embaralhada!");
  }
}
