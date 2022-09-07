import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Player, ConnectionState, DefaultQueue } from "vulkava";
import { User, VoiceChannel } from "eris";

export default class Stop extends Command {
  constructor(client: Client) {
    super(client, {
      name: "queue",
      description: "Vê a lista de musicas que estão na fila",
      category: "Music",
      aliases: ["lista", "list"],
      options: [], //lol
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
  
    let player = this.client.music.players.get(ctx.msg.guildID);

    if (!player) {
      ctx.sendMessage("Não estou a tocar nada");
      return;
    }

    const vc = ctx.msg.member.voiceState.channelID;
    if (!vc) {
      ctx.sendMessage("Precisas estar em um canal de voz");
      return;
    }
    let test: Array<String> = [];
    const playerQueue = player.queue as DefaultQueue
    playerQueue.tracks.forEach((q) => {
      const requester = q.requester as User;
      const autor = this.client.users.get(requester.id);
      test.push(
        "`" +
          q.title +
          "`" +
          "- " +
          "_(" +
          autor.username +
          "#" +
          autor.discriminator +
          ")_"
      );
    });
    if (!test.length) {
      ctx.sendMessage("Não há mais nada na fila");
    }
    console.log(test.length);
    if (test.length > 50) test = test.slice(0, 50);

    const quebed = new this.client.embed()
      .setTitle(":star: Lista de musicas")
      .setDescription(test.join("\n"))
      .setColor("RANDOM")
      .setFooter(ctx.author.username + "#" + ctx.author.discriminator)
      .setTimestamp();
    ctx.sendMessage({ embed: quebed });

  }
}
