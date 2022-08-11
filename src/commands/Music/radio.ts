import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Player, ConnectionState } from "vulkava";
import { VoiceChannel } from "eris";

export default class PlayRadio extends Command {
  constructor(client: Client) {
    super(client, {
      name: "radio",
      description: "Toca uma Rádio",
      category: "Music",
      aliases: ["tocarradio", "radio"],
      options: [], //lol
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    if (ctx.channel.type !== 0 || !ctx.guild) return;

    let currPlayer = this.client.music.players.get(ctx.guild.id as string);

    if (!this.client.music.canPlay(ctx, currPlayer)) return;

    const voiceChannelID = ctx.member?.voiceState.channelID as string;
    const voiceChannel = this.client.getChannel(voiceChannelID) as VoiceChannel;

    try {
      let player = this.client.music.players.get(ctx.guild.id);
      if (!player) {
        player = this.client.music.createPlayer({
          guildId: ctx.guild.id,
          voiceChannelId: voiceChannelID,
          textChannelId: ctx.channel.id,
          selfDeaf: true,
        });
      }
      let array = [
        "oceanopacifico",
        "renascenca",
        "comercial",
        "cidadefm",
        "smoothfm",
        "vodafone",
        "tsf",
        "m80",
        "rfm",
      ];
      if (!ctx.args[0]) {
        ctx.sendMessage(`Rádios disponiveis: \`${array.join(",")}\``);
        return;
      }
      const res = await this.client.music.search(
        `https://m.danitto.live/${ctx.args[0]}`
      );

      if (res.loadType !== "TRACK_LOADED") {
        ctx.sendMessage({
          content: `Houve um problema ao tocar a rádio solicitada\nRádios disponiveis: \`${array.join(
            ","
          )}\``,
          flags: 1 << 6,
        });
        player.destroy();
        return;
      }

      if (player.state === ConnectionState.DISCONNECTED) {
        if (
          !voiceChannel
            .permissionsOf(this.client.user.id)
            .has("manageChannels") &&
          voiceChannel.userLimit &&
          voiceChannel.voiceMembers.size >= voiceChannel.userLimit
        ) {
          ctx.sendMessage({
            content: ":x: O canal de voz está cheio!",
            flags: 1 << 6,
          });
          player.destroy();
          return;
        }
        player.connect();
      }

      if (player.current) {
        player.queue = [];
        player.skip();
      }

      player.textChannelId = ctx.channel.id;
      player.isRadio = true;
      res.tracks[0].setRequester(ctx.author);
      player.queue.push(res.tracks[0]);

      if (!player.playing) player.play();
    } catch (err: any) {
      ctx.sendMessage(`Erro: \`${err.message}\``);
    }
  }
}
