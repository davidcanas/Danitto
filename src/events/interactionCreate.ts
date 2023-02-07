import Client from "../structures/Client";
import { Interaction, CommandInteraction, ComponentInteraction, TextChannel } from "oceanic.js";
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
        _id: interaction.member!.id,
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
        return interaction.createMessage({content:`O comando \`${interaction.data.name}\` foi desativado pelo meu dono....`}
          
        );
      }
      const ctx = new CommandContext(this.client, interaction);

      cmd.execute(ctx);

      const bot = await this.client.db.bot.findOne({
        botID: this.client.user.id,
      });
      const cmds = await this.client.db.cmds.findOne({
        name: interaction.data.name,
      });
      if (bot) {
        bot.commands++;

        bot.save();
      }
      if (cmd.category !== "Owner") {
        cmds.uses++;
      }
      cmds.save();
      const embed = new this.client.embed()
        .setTitle("Comando executado")
        .setDescription(
          `Autor: ${interaction.member!.username}#${
            interaction.member!.discriminator
          } (${interaction.member!.id})\nComando: /${cmd.name}\nServidor: ${
            this.client.guilds.get(interaction.guildID).name
          } (${interaction.guildID})\nCanal: ${
            this.client.guilds
              .get(interaction.guildID)
              .channels.get(interaction.channel.id).name
          } (${interaction.channel.id})`
        )
        .setFooter("Foram usados slash commands ao executar o comando.")
        .setColor("RANDOM");

        const channel = await this.client.getChannel("929319573973528647") as TextChannel;
        
        channel.createMessage({ embeds: [embed] });
    }
    if (!(interaction instanceof CommandInteraction)) {
      if (interaction instanceof ComponentInteraction) {
        for (const collector of this.client.componentCollectors) {
          if (collector.message.id === interaction.message.id) {
            collector.collect(interaction);
            break;
          }
        }

        if (interaction.data.customID === "delmsgeval") {
          if (interaction.member?.id !== "733963304610824252") return;
          interaction.channel.messages.get(interaction.message.id).delete();
        }
        if (interaction.data.customID === "delmsgshell") {
          if (interaction.member?.id !== "733963304610824252") return;
          interaction.channel.messages.get(interaction.message.id).delete();
        }
      }
      return;
    }
    /*if (interaction instanceof ComponentInteraction) {
      
    }*/
  }
}
