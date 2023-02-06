import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Player, ConnectionState } from "vulkava";
import { VoiceChannel } from "oceanic.js";

export default class Stop extends Command {
  constructor(client: Client) {
    super(client, {
      name: "pause",
      description: "Pausa/despausa a música atual",
      category: "Music",
      aliases: ["pausar", "despausar"],
      options: [],
        
    });
  }

  async execute(ctx: CommandContext): Promise<void> {


    const player = this.client.music.players.get(ctx.guild.id);
    const voiceChannelID = ctx.member?.voiceState?.channelID;

    if (!player || !player.current) {
      ctx.sendMessage({ content: 'Não estou a tocar nada.', flags: 1 << 6 });
      return;
    }




  

      if (player.paused) {
        ctx.sendMessage("Música despausada!");
        player.pause(false);
        return;
      }

      player.pause(true);
      ctx.sendMessage('Música pausada!');



  }
}
