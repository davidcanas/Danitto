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
    if (message.author.bot) return;

    for (const collector of this.client.messageCollectors) {
      if (collector.channel.id === message.channel.id) {
        collector.collect(message);
      }
    }

    let prefix;
    if (process.env.DEVELOPMENT === "true") {
      prefix = "dc.";
    } else {
      prefix = "d.";
    }

    if (
      message.content.startsWith(`<@${this.client.user.id}>`) ||
      message.content.startsWith(`<@!${this.client.user.id}>`)
    ) {
      const embed1 = new this.client.embed()
        .setTitle(
          "Olá " + message.author.username + "#" + message.author.discriminator
        )
        .setDescription(
          `Eu funciono com slash commands . então usa /help para veres os meus comandos\n_Eu tambem funciono com message commands ainda (prefixo: d.)_`
        )
        .setColor("RANDOM")
        .setTimestamp();

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
      setTimeout(() => {
        if (mensagem) mensagem.delete();
      }, 5000);
      mensagem.addReaction("👍");
      const filter = (r: Emoji, user: User) =>
        r.name === "👍" && user === message.author;
      const collector = new ReactionCollector(this.client, mensagem, filter, {
        max: 1,
      });
      collector.on("collect", () => {
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
        _id: message.author.id,
      });
      if (user && user.blacklist) {
        let embed = new this.client.embed()
          .setDescription(
            "❌ Estás na minha blacklist então não podes usar mais comandos , caso aches injusto [clica aqui](https://dink.ga/blacklistDanitto) !"
          )
          .setColor("RANDOM");
        return message.channel.createMessage({ embeds: [embed] });
      }
      const dbcmd = await this.client.db.cmds.findOne({ name: command.name });

      if (
        message.author.id !== "733963304610824252" &&
        dbcmd &&
        dbcmd.disabled
      ) {
        return message.channel.createMessage(
          `O comando \`${command.name}\` foi desativado pelo meu programador....`
        );
      }
      const ctx = new CommandContext(this.client, message, args);

      command.execute(ctx);
      if (
        message.channel.type === 0 &&
        message.author.id !== "733963304610824252"
      ) {
        const embed = new this.client.embed()
          .setTitle("Comando executado")
          .setDescription(
            `Autor: ${message.author.username}#${
              message.author.discriminator
            } (${message.author.id})\nComando: ${cmd}\nServidor: ${
              this.client.guilds.get(message.guildID).name
            } (${message.guildID})\nCanal: ${
              this.client.guilds
                .get(message.guildID)
                .channels.get(message.channel.id).name
            } (${message.channel.id})`
          )
          .setFooter("Não foram usados slash commands ao executar o comando.")
          .setColor("RANDOM");
        this.client.createMessage("929319573973528647", { embeds: [embed] });
      } else if (
        message.channel.type !== 0 &&
        message.author.id !== "733963304610824252"
      ) {
        const embed = new this.client.embed()
          .setTitle("Comando executado")
          .setDescription(
            `Autor: ${message.author.username}#${message.author.discriminator} (${message.author.id})\nComando: ${cmd}`
          )
          .setFooter("Comando executado no privado");
          (await this.client.getDMChannel(message.author.id)).createMessage({embeds: [embed]})
      }
      const bot = await this.client.db.bot.findOne({
        botID: this.client.user.id,
      });
      const cmds = await this.client.db.cmds.findOne({
        name: command.name,
      });
      if (bot) {
        bot.commands++;
       
        bot.save();
      }
      if(command.category !== "Owner") {
        cmds.uses++;
        console.log("+1")
        }
        cmds.save()
    }
  }
}
