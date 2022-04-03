import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { ApplicationCommandOption } from "eris";

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
    /*	if (args === "prefix") {
				const model = this.client.db.guild
				const update = await model.findOne({
					guildID: ctx.guild.id
				})
	
				if (update) {
					update.Settings.prefix = ctx.args[1]
					update.save()
					ctx.sendMessage("Atualizei o prefixo neste servidor para " + ctx.args[1])
				}
			}*/
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
