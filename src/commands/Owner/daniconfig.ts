import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import {
  ActionRow,
  ActionRowComponents,
  ComponentInteraction,
  ComponentInteractionSelectMenuData,
  Message,
  SelectMenuOptions,
} from "eris";
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
          ],
        },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    if (ctx.author.id !== "733963304610824252") return;
    const args = ctx.args[0];
    if (!args) {
      ctx.sendMessage({
        content:
          "Estás perdido? Eu dou te uma ajudinha : `cmdupdate, prefix, shutdown` espero ter te ajudado :)",
        flags: 1 << 6,
      });

      return;
    }

    if (args === "cmdupdate") {
      const model = this.client.db.cmds;
      await this.client.db.cmds.deleteMany({});

      this.client.commands.forEach((cmd) => {
        model.create({
          name: cmd.name,
          aliases: cmd.aliases,
          description: cmd.description,
          category: cmd.category,
        });
      });
      ctx.sendMessage(
        "Atualizei a lista de comandos no website do danitto podes ver la em https://danitto.live/comandos !"
      );
    }
    if (args === "cmddisable") {
      let array = await this.client.db.cmds.find({});
      let cmdArrayComponent = [];
      let cmdArray = [];
      array.forEach((cmd) => {
        if (!cmd.disabled) {
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
      const menu: ActionRowComponents[] = [
        {
          custom_id: "menu",
          type: 3,
          placeholder: "Seleciona o comando a desativar",
          options: cmdArrayComponent,
        },
      ];
      const row: ActionRow = {
        type: 1,
        components: menu,
      };

      msg = (await ctx.sendMessage({
        embeds: [embed],
        components: [row],
      })) as Message;

      const filter = (i: ComponentInteraction) =>
        i.member!.id === ctx.author.id;

      const collector = new ComponentCollector(this.client, msg, filter, {
        max: 1,
        time: 5 * 1000,
      });

      collector.on("collect", async (i) => {
        const data = i.data as ComponentInteractionSelectMenuData;
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
        if (cmd.disabled) {
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
      const menu: ActionRowComponents[] = [
        {
          custom_id: "menu",
          type: 3,
          placeholder: "Seleciona o comando a ativar",
          options: cmdArrayComponent,
        },
      ];
      const row: ActionRow = {
        type: 1,
        components: menu,
      };

      msg = (await ctx.sendMessage({
        embeds: [embed],
        components: [row],
      })) as Message;

      const filter = (i: ComponentInteraction) =>
        i.member!.id === ctx.author.id;

      const collector = new ComponentCollector(this.client, msg, filter, {
        max: 1,
        time: 5 * 1000,
      });

      collector.on("collect", async (i) => {
        const data = i.data as ComponentInteractionSelectMenuData;
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
