import Client from "../structures/Client";

import { Member, VoiceChannel } from "eris";

export default class MessageReactionRemove {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run(member: Member, oldChannel: VoiceChannel) {
    const player = this.client.music.players.get(member.guild.id);
    if (!player) return;

    if (member.id === this.client.user.id) {
      this.client.createMessage(
        player.textChannelId!,
        "Fui expulso do canal de voz então parei a música"
      );
      player.destroy();
    }

    if (
      !member.bot &&
      oldChannel.id === player.voiceChannelId &&
      !oldChannel.voiceMembers.filter((m) => !m.bot).length
    ) {
      this.client.createMessage(
        player.textChannelId!,
        `Ninguem está na call, portanto vou parar a música.`
      );
      player.destroy();
    }
  }
}
