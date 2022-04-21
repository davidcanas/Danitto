import Client from "../structures/Client";
import { Emoji, Message, User } from "eris";
import CommandContext from "../structures/CommandContext";
import { ReactionCollector } from "../structures/Collector";
export default class InteractionCreate {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run(message: Message) {
    for (const collector of this.client.messageCollectors) {
      if (collector.channel.id === message.channel.id) {
        collector.collect(message);
      }
    }

    if (message.author.bot) return;

    let gRes = await this.client.db.guild.findOne({
      guildID: message.guildID,
    });

    if (!gRes) {
      await this.client.db.guild.create({
        guildID: message.guildID,
        Settings: {
          prefix: "d/",
        },
      });
      gRes = await this.client.db.guild.findOne({
        guildID: message.guildID,
      });
    }
    let prefix;
    if (process.env.DEVELOPMENT === "true") {
      prefix = "dc.";
    } else {
      prefix = "d/";
    }
    //a
    if (
      message.content.startsWith(`<@${this.client.user.id}>`) ||
      message.content.startsWith(`<@!${this.client.user.id}>`)
    ) {
      const embed1 = new this.client.embed()
        .setTitle(
          "Olá " + message.author.username + "#" + message.author.discriminator
        )
        .setDescription(
          `Neste servidor o meu prefixo é ${prefix} usa ${prefix}help para veres os meus comandos`
        )
        .setColor("RANDOM")
        .setFooter("Danitto - 2022 ");

      return message.channel.createMessage({
        embeds: [embed1],
      });
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift()?.toLowerCase();

    if (!cmd) return;

    const command = this.client.commands.find(
      (c) => c.name === cmd || c.aliases?.includes(cmd)
    );

    if (!command) {
      let cmds: string[] = [];
      this.client.commands.forEach((cmd) => {
        cmds.push(cmd.name);
        if (cmd.aliases) cmds = cmds.concat(cmd.aliases);
      });
      let diduMean = "";
      let levDistanceLevel = Infinity;

      cmds.forEach((cmd1) => {
        const levDistance = this.client.utils.levDistance(cmd, cmd1);

        if (levDistance < levDistanceLevel) {
          diduMean = cmd1;
          levDistanceLevel = levDistance;
        }
      });
      const mensagem = await message.channel.createMessage({
        content: `Eu não encontrei o comando ${cmd}, querias dizer ${diduMean}?\n\`Caso queiras executar o comando sem ter que gastar uma caloria reage com 👍 !\``,
      });
      mensagem.addReaction("👍");
      const filter = (r: Emoji, user: User) =>
        r.name === "👍" && user === message.author;
      const collector = new ReactionCollector(this.client, mensagem, filter, {
        max: 1,
      });
      collector.on("collect", () => {
        console.log("a");
        message.content = `${prefix}${diduMean} ${args.join(" ")}`.trim();
        this.client.emit("messageCreate", message);
        mensagem.delete();
      });

      collector.on("end", (reason) => {
        if (reason === "Time") {
          if (mensagem) mensagem.delete();
        }
      });
      collector.on("end", () => {
        mensagem.delete();
      });
    }
    if (command) {
      let user = await this.client.db.users.findOne({
        userID: message.author.id,
      });
      if (user && user.blacklist) {
        let embed = new this.client.embed()
          .setDescription(
            "❌ Estás na minha blacklist então não podes usar mais comandos , caso aches injusto [clica aqui](https://dink.ga/blacklistDanitto) !"
          )
          .setColor("RANDOM");
        return message.channel.createMessage({ embeds: [embed] });
      }
     const dbcmd = await this.client.db.cmds.findOne({name: command.name})
              
      if(dbcmd && dbcmd.disabled) {
        return message.channel.createMessage(`O comando \`${command.name}\` foi desativado pelo meu dono....`)
      }
      const ctx = new CommandContext(this.client, message, args);

      command.execute(ctx);
      const bot = await this.client.db.bot.findOne({
        botID: this.client.user.id,
      });
      if (bot) {
        bot.commands++;
        bot.save();
      }
    }
  }
}
