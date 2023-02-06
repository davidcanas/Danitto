import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Player, ConnectionState } from "vulkava";

export default class Skip extends Command {
  constructor(client: Client) {
    super(client, {
      name: "skip",
      description: "Pula uma Musica",
      category: "Music",
      aliases: ["pular", "s", "skippar"],
      options: [],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    if (ctx.channel.type !== 0 || !ctx.guild) return;

    const currPlayer = this.client.music.players.get(ctx.guild.id as string);
    const voiceChannelID = ctx.member?.voiceState.channelID;

   
    if (!currPlayer || currPlayer.state === ConnectionState.DISCONNECTED) {
      ctx.sendMessage("Não estou tocando nada.");
      return;
    }

    currPlayer.skip();
    ctx.sendMessage("Musica skippada por " + ctx.author.username);
  }
}
