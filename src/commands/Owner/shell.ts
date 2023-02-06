const { exec } = require("child_process");
const { inspect } = require("util");
import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class Shell extends Command {
  constructor(client: Client) {
    super(client, {
      name: "shell",
      description: "Executa algo",
      category: "Owner",
      aliases: ["execute"],
      options: [
        {
          name: "code",
          type: 3,
          description: "O código a executar.",
          required: true,
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
    const code = ctx.args.join(" ");
    if (code.includes("python3"))
      ctx.sendMessage(
        "wolverine malandro executando codigo sus? vou deixar passar"
      );
    exec(code, async (error, stdout) => {
      try {
        const outputType = error || stdout;
        let output = outputType;
        if (!output.length) output = "O comando não retornou nada";

        if (output.length > 1980) {
          const bin = await ctx.createBin(
            require("sourcebin"),
            output,
            "shell"
          );
          output = bin.short;
        }

        if (
          output.includes(process.env.DANITOKEN) ||
          output.includes(process.env.DANITOKEN2) ||
          output.includes(process.env.MONGODB)
        ) {
          ctx.sendMessage(
            "⚠ Não poderei enviar o codigo asseguir aqui porque ele contem dados privados. Ele foi enviado na DM do Canas"
          );
          this.client.users
            .get("733963304610824252").createDM()
            .then(async (dm) => {
              await dm.createMessage({content:`\`\`\`ansi\n${output}\n\`\`\``});
            });
          return;
        }
        return ctx.sendMessage({
          content: "```ansi\n" + output + "\n```",
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 2,
                  label: "🚮 Apagar Shell",
                  customID: "delmsgshell",
                },
              ],
            },
          ],
        });
      } catch (err) {
        ctx.sendMessage({
          content: "Erro: " + err,
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 2,
                  label: "🚮 Apagar Erro",
                  customID: "delmsgshell",
                },
              ],
            },
          ],
        });
      }
    });
  }
}
