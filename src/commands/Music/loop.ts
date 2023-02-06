import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Player, ConnectionState } from "vulkava";
import { VoiceChannel } from "oceanic.js";

export default class Stop extends Command {
  constructor(client: Client) {
    super(client, {
      name: "loop",
      description: "Repete a musica atual ou a queue toda",
      category: "Music",
      aliases: ["repeat", "repetir"],
      options: [
        {
          type: 3,
          name: "oquefazer",
          description: "O que fazer?",
          choices: [
            {
              name: "Repetir a música atual",
              value: "track",
            },
            {
              name: "Repetir a queue atual ",
              value: "queue",
            },
          ],
        },
      ],
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
      ctx.sendMessage("Não estou a tocar nada.");
      return;
    }

    if (ctx.args[0] === "track") {
      currPlayer.setTrackLoop(!currPlayer.trackRepeat);
      ctx.sendMessage("A repetir a música atual!");
      return;
    }

    if (ctx.args[0] === "queue") {
      currPlayer.setQueueLoop(!currPlayer.queueRepeat);
      ctx.sendMessage("A repetir a queue atual!");
      return;
    }
    ctx.sendMessage(
      "Ocorreu um erro, provavelmente inseriste um argumento inválido."
    );
  }
}
