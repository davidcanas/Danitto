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
      const dbcmd = await this.client.db.cmds.findOne({name: interaction.data.name})
      
              
      if(interaction.user.id !== "733963304610824252" && dbcmd && dbcmd.disabled) {
        return interaction.createMessage(`O comando \`${interaction.data.name}\` foi desativado pelo meu dono....`)
      }
      const ctx = new CommandContext(this.client, interaction);

      cmd.execute(ctx);
    }
    if (!(interaction instanceof CommandInteraction)) {
      if (interaction instanceof ComponentInteraction) {
        for (const collector of this.client.componentCollectors) {
          if (collector.message.id === interaction.message.id) {
            collector.collect(interaction);
            break;
          }
        }
      }
      return;
    }
    /*if (interaction instanceof ComponentInteraction) {
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
    }*/
  }
}
