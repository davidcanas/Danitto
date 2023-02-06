import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Player, ConnectionState } from "vulkava";
import { VoiceChannel } from "oceanic.js";

export default class Volume extends Command {
  constructor(client: Client) {
    super(client, {
      name: "speedup",
      description: "Ativa/desativa o modo speedup na musica",
      category: "Music",
      aliases: ["speedup"],
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
        content: "Precisas de estar no mesmo canal de voz que eu!",
        flags: 1 << 6,
      });
      return;
    }
    if (!currPlayer || currPlayer.state === ConnectionState.DISCONNECTED) {
      ctx.sendMessage("Não estou a tocar nada nesse momento.");
      return; 
    }
    
    if (!currPlayer.speedup) {
      currPlayer.filters.setTimescale({pitch: 1.18, rate: 1.10, speed: 1.15})
      ctx.sendMessage("Modo speedup ativado!")
      currPlayer.speedup = true;
      return;
    } else if(currPlayer.speedup) {
      currPlayer.filters.clear()
      ctx.sendMessage("Modo speedup desativado!")
       currPlayer.speedup = false;
       return;

    }

    ctx.sendMessage({content: "Ocorreu um problema"})
  }}