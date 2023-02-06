import Client from "../structures/Client";

import { Member, TextChannel, VoiceChannel } from "oceanic.js";

export default class MessageReactionRemove {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run(member: Member, oldChannel: VoiceChannel) {
    const player = this.client.music.players.get(member.guild.id);
    if (!player) return;

    if (member.id === this.client.user.id) {
      const ch = this.client.getChannel(player.voiceChannelId!) as TextChannel;
      ch.createMessage({content:"Fui expulso do canal de voz então parei a música"});
      player.destroy();
    }

    if (
      !member.bot &&
      oldChannel.id === player.voiceChannelId &&
      !oldChannel.voiceMembers.filter((m) => !m.bot).length
    ) {
      const ch = this.client.getChannel(player.voiceChannelId!) as TextChannel;
      ch.createMessage({content:"Nínguem está na call então parei a música"});
      player.destroy();
    }
  }
}
