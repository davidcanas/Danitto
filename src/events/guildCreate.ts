import Client from "../structures/Client";

import { Guild } from "oceanic.js";

export default class GuildCreate {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run(guild: Guild) {
    const embed = new this.client.embed()
      .setTitle("Entrei num novo servidor")
      .setColor("RANDOM")
      .addField(":id: Nome", `\`${guild.name}\``, true)
      .addField(
        ":crown: Dono",
        `\`${this.client.users.get(guild.ownerID)?.username}#${
          this.client.users.get(guild.ownerID)?.discriminator
        }\``,
        true
      )
      .addField(":closed_book: ID", `\`${guild.id}\``, true)
      .addField(":man: Membros", `\`${guild.members.size}\``, true)
      .setTimestamp();

    guild.iconURL("png") && embed.setThumbnail(guild.iconURL("png")!);

    const channel = await this.client.users
      .get("733963304610824252")
      ?.createDM();

    channel && channel.createMessage({ embeds: [embed] });
  }
}
