import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Player, ConnectionState } from "vulkava";
import { VoiceChannel } from "eris";

export default class Skip extends Command {
  constructor(client: Client) {
    super(client, {
      name: "skip",
      description: "Pula uma Musica",
      category: "Music",
      aliases: ["pular", "s", "skippar"],
      options: [], //lol
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
        content: "tu n estás na msm casa q eu!",
        flags: 1 << 6,
      });
      return;
    }
    if (!currPlayer || currPlayer.state === ConnectionState.DISCONNECTED) {
      ctx.sendMessage("Não estou tocando nada.");
      return;
    }

    currPlayer.skip();
    ctx.sendMessage("Musica skippada por " + ctx.author.username);
  }
}
