import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Type } from "../../structures/CommandContext";

export default class Render extends Command {
  constructor(client: Client) {
    super(client, {
      name: "render",
      description: "Renderiza uma página web",
      category: "Util",
      aliases: ["printsite", "renderizar"],
      options: [
        {
          name: "link",
          type: 3,
          description: "O link do website a renderizar",
          required: true,
        },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    if (ctx.channel.type !== 0) return;

    if (ctx.channel.nsfw || this.client.allowedUsers.includes(ctx.author.id)) {
      let msg;
      let args = ctx.args[0];
      if (!args) {
        ctx.sendMessage(
          "Precisas de explicitar o link do website a renderizar"
        );
        return;
      }
      if (!args.startsWith("http")) {
        args = "https://" + ctx.args[0];
      }

      if (ctx.type !== Type.INTERACTION) {
        msg = await ctx.sendMessage("A renderizar...");
      } else {
        ctx.defer();
      }
      const fetch = await this.client.fetch(
        `https://image.thum.io/get/maxAge/12/width/1200/${args}`
      );

      setTimeout(async () => {
        if (fetch.headers.get("content-type") !== "image/png") {
          if (ctx.type !== Type.INTERACTION) {
            msg.edit("Não consegui renderizar esse website");
          } else {
            ctx.sendMessage("Não consegui renderizar esse website");
          }
          return;
        }
        const embed = new this.client.embed()
          .setTitle("Website Renderizado")
          .setImage(`https://image.thum.io/get/maxAge/12/width/1200/${args}`)
          .setColor("RANDOM");

        if (ctx.type !== Type.INTERACTION) {
          msg.edit({ content: "", embed });
        } else {
          ctx.sendMessage({ content: "", embed });
        }
      }, 10000);
    } else {
      ctx.sendMessage("Apenas podes usar este comando em um canal NSFW");
    }
  }
}
