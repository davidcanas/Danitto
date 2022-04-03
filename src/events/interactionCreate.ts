import Client from "../structures/Client";
import { Interaction, CommandInteraction, ComponentInteraction } from "eris";
import CommandContext from "../structures/CommandContext";

export default class InteractionCreate {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run(interaction: Interaction) {
    if (interaction instanceof CommandInteraction) {
      const cmd = this.client.commands.find(
        (c) => c.name === interaction.data.name
      );
      if (!cmd) throw new Error("Command not found '-'");
      const ctx = new CommandContext(this.client, interaction);

      cmd.execute(ctx);
    }
    if (interaction instanceof ComponentInteraction) {
      if (interaction.data.custom_id === "delmsgeval") {
        if (interaction.member?.id !== "733963304610824252") return;
        interaction.channel.messages.get(interaction.message.id).edit({
          content: "🔒 Eval Fechado!",
          embeds: [],
          components: [],
        });
      }
      if (interaction.data.custom_id === "delmsgshell") {
        if (interaction.member?.id !== "733963304610824252") return;
        interaction.channel.messages.get(interaction.message.id).edit({
          content: "🔒 Shell Fechado!",
          embeds: [],
          components: [],
        });
      }
    }
  }
}
