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
      let user = await this.client.db.users.findOne({
        userID: interaction.member!.id,
      });
      if (user && user.blacklist) {
        let embed = new this.client.embed()
          .setDescription(
            "❌ Estás na minha blacklist então não podes usar mais comandos , caso aches injusto [clica aqui](https://dink.ga/blacklistDanitto) !"
          )
          .setColor("RANDOM");
        return interaction.createMessage({ embeds: [embed] });
      }

      const dbcmd = await this.client.db.cmds.findOne({
        name: interaction.data.name,
      });

      if (dbcmd && dbcmd.disabled) {
        return interaction.createMessage(
          `O comando \`${interaction.data.name}\` foi desativado pelo meu dono....`
        );
      }
      const ctx = new CommandContext(this.client, interaction);

      cmd.execute(ctx);
      const embed = new this.client.embed()
      .setTitle("Comando executado")
      .setDescription(`Autor: ${interaction.member!.username}#${interaction.member!.discriminator} (${interaction.member!.id})\nComando: /${cmd.name}\nServidor: ${this.client.guilds.get(interaction.guildID).name} (${interaction.guildID})\nCanal: ${this.client.guilds.get(interaction.guildID).channels.get(interaction.channel.id).name} (${interaction.channel.id})`)
      .setFooter("Foram usados slash commands ao executar o comando.")
      .setColor("RANDOM")
      this.client.createMessage("929319573973528647", {embeds: [embed]});
    }
    if (!(interaction instanceof CommandInteraction)) {
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
      
    }*/
  }
}
