import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import {
  ComponentInteraction,
  Message, MessageActionRow, MessageComponentSelectMenuInteractionData
} from "oceanic.js";
import { ComponentCollector } from "../../structures/Collector";
export default class DaniConfig extends Command {
  constructor(client: Client) {
    super(client, {
      name: "112",
      description: "Comando util para executar diversas ações no bot",
      category: "Owner",
      aliases: ["daniconfig", "configdani", "cfg"],
      options: [
        {
          type: 3,
          name: "oquefazer",
          description: "O que fazer?",
          choices: [
            {
              name: "Desligar Danitto",
              value: "shutdown",
            },
            {
              name: "Atualizar comandos no website ",
              value: "cmdupdate",
            },
            {
              name: "Desativar um comando",
              value: "cmddisable",
            },
            {
              name: "Reativar um comando",
              value: "cmdenable",
            },
            {
              name: "Leaderboard de comandos usados",
              value: "topcmds",
            },
          ],
        },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    if (!this.client.allowedUsers.includes(ctx.author.id)) {
      ctx.sendMessage({
        content:
          "Não tens acesso a este comando, apenas o meu programador o pode usar.",
        flags: 1 << 6,
      });
      return;
    }
    const args = ctx.args[0];
    if (!args) {
      ctx.sendMessage({
        content:
          "Estás perdido? Eu dou te uma ajudinha : `cmdupdate, cmddisable, cmdenable, prefix,  topcmds, shutdown` espero ter te ajudado :)",
        flags: 1 << 6,
      });

      return;
    }
    if (args === "topcmds") {
      let model = await this.client.db.cmds.find({});
      model = model.sort((a, b) => b.uses - a.uses);
      const array = [];
      model.forEach((a) => {
        array.push(`${a.name} - ${a.uses} vezes usado`);
      });
      const embed = new this.client.embed()
        .setTitle("TOP comandos usados")
        .setDescription(array.join("\n"));

      ctx.sendMessage({ embeds: [embed] });
    }
    if (args === "cmdupdate") {
      const model = this.client.db.cmds;

      this.client.commands.forEach(async (cmd) => {
        const exists = await this.client.db.cmds.findOne({ name: cmd.name });
        if (!exists) {
          model.create({
            name: cmd.name,
            aliases: cmd.aliases,
            description: cmd.description,
            category: cmd.category,
          });
        } else {
          model.updateOne({
            name: cmd.name,
            aliases: cmd.aliases,
            description: cmd.description,
            category: cmd.category,
            uses: exists.uses,
          });
        }
      });
      ctx.sendMessage(
        "Atualizei a lista de comandos podes vê-la em https://danitto.tk/comandos !"
      );
    }
    if (args === "cmddisable") {
      let array = await this.client.db.cmds.find({});
      let cmdArrayComponent = [];
      let cmdArray = [];
      array.forEach((cmd) => {
        if (!cmd.disabled && cmd.category !== "Owner") {
          cmdArrayComponent.push({ label: cmd.name, value: cmd.name });
          cmdArray.push(cmd.name);
        }
      });
      let msg: Message;
      const embed = new this.client.embed()
        .setTitle("Desativar um comando")
        .setDescription(
          `Escolhe um comando para desativar\n\n${cmdArray.join("\n")}`
        );
     cmdArrayComponent = cmdArrayComponent.slice(0, 25);
      const row: MessageActionRow = {
        type: 1,
        components: [ 
          {
          customID: "menu",
          type: 3,
          placeholder: "Seleciona o comando a desativar",
          options: cmdArrayComponent,
        },
      ],
      };

      msg = (await ctx.sendMessage({
        embeds: [embed],
        components: [row],
      })) as Message;

      const filter = (i: ComponentInteraction) =>
        i.member!.id === ctx.author.id;

      const collector = new ComponentCollector(this.client, msg, filter, {
        max: 1,
      });

      collector.on("collect", async (i) => {
        const data = i.data as MessageComponentSelectMenuInteractionData;
        const value = data.values[0];
        msg.edit({
          content: `Desativei o commando ${value} com sucesso`,
          embeds: [],
          components: [],
        });
        const db = await this.client.db.cmds.findOne({ name: value });
        db.disabled = true;
        db.save();
      });
    }
    if (args === "cmdenable") {
      let array = await this.client.db.cmds.find({});
      let cmdArrayComponent = [];
      let cmdArray = [];
      array.forEach((cmd) => {
        if (cmd.disabled && cmd.category !== "Owner") {
          cmdArrayComponent.push({ label: cmd.name, value: cmd.name });
          cmdArray.push(cmd.name);
        }
      });
      let msg: Message;
      const embed = new this.client.embed()
        .setTitle("Ativar um comando")
        .setDescription(
          `Escolhe um comando para ativar\n\n${cmdArray.join("\n")}`
        );

      const row: MessageActionRow = {
        type: 1,
        components:  [
          {
            customID: "menu",
            type: 3,
            placeholder: "Seleciona o comando a ativar",
            options: cmdArrayComponent,
          },
        ],
      };

      msg = (await ctx.sendMessage({
        embeds: [embed],
        components: [row],
      })) as Message;

      const filter = (i: ComponentInteraction) =>
        i.member!.id === ctx.author.id;

      const collector = new ComponentCollector(this.client, msg, filter, {
        max: 1,
      });

      collector.on("collect", async (i) => {
        const data = i.data as MessageComponentSelectMenuInteractionData;;
        const value = data.values[0];
        msg.edit({
          content: `Reativei o commando ${value} com sucesso`,
          embeds: [],
          components: [],
        });
        const db = await this.client.db.cmds.findOne({ name: value });
        db.disabled = false;
        db.save();
      });
    }
    if (args === "shutdown" || args === "desligar") {
      ctx.sendMessage({
        content: "Ok, estou desligando em 7 segundos !",
        flags: 1 << 6,
      });
      setTimeout(function () {
        process.exit(1);
      }, 7000);
    }
    if (args === "manu") {
      const op = ctx.args[1];
      if (!op) {
        ctx.sendMessage("Precisas de informar se queres ativar ou desativar !");
        return;
      }
      if (op === "on") {
        const man = await this.client.db.bot.findOne({
          botID: this.client.user.id,
        });
        if (man) {
          man.manu = true;
          man.save();
          ctx.sendMessage("Ok ativei o modo de manutenção");
        } else {
          ctx.sendMessage("Ocorreu um erro a encontrar o modelo...");
        }
      }
      if (op === "off") {
        const man = await this.client.db.bot.findOne({
          botID: this.client.user.id,
        });
        if (man) {
          man.manu = false;
          man.save();
          ctx.sendMessage("Ok desativei o modo de manutenção");
        } else {
          ctx.sendMessage("Ocorreu um erro a encontrar o modelo...");
        }
      }
    }
  }
}
