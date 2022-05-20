import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class Blacklist extends Command {
  constructor(client: Client) {
    super(client, {
      name: "blacklist",
      description: "Adiciona/Remove um usuário na blacklist do Danitto",
      category: "Owner",
      aliases: ["bladd", "blrem"],
      options: [
        {
          type: 3,
          name: "addremove",
          description: "Adicionar ou remover alguém da blacklist?",
          required: true,
          choices: [
            {
              name: "Adicionar",
              value: "add",
            },
            {
              name: "Remover",
              value: "remove",
            },
          ],
        },
        {
          name: "user",
          type: 3,
          description: "O usuario a adicionar.",
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
    const args = ctx.args[0];
    if (args === "add") {
      let user = await this.client.findUser(ctx.args[1], ctx.guild);
      if (!user) {
        ctx.sendMessage("Este usuario não existe!");
        return;
      }
      var userDB = await this.client.db.users.findOne({ _id: user.id });
      if (!userDB) {
        await this.client.db.users.create({
          _id: user.id,
          user: {
            id: user.id,
            username: user.username,
          },
        });
        userDB = await this.client.db.users.findOne({ _id: user.id });
      }
      userDB.blacklist = true;
      userDB.save();
      ctx.sendMessage("O usuario foi adicionado á blacklist com sucesso!");
    }
    if (args === "remove") {
      let user = await this.client.findUser(ctx.args[1], ctx.guild);
      if (!user) {
        ctx.sendMessage("Este usuario não existe!");
        return;
      }
      var userDB = await this.client.db.users.findOne({ _id: user.id });
      if (!userDB) {
        await this.client.db.users.create({
          _id: user.id,
          user: {
            id: user.id,
            username: user.username,
          },
        });
        userDB = await this.client.db.users.findOne({ _id: user.id });
      }
      userDB.blacklist = false;
      userDB.save();
      ctx.sendMessage("O usuario foi removido da blacklist com sucesso!");
    }
  }
}
