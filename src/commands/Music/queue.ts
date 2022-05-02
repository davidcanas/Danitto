import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { Player, ConnectionState } from "vulkava";
import { VoiceChannel } from "eris";

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
        return
    }
 let test: Array<String> = []
    player.queue.forEach(q => {
    const autor = this.client.users.get(q.author);
  test.push("`" + q.title + "`" + "- " + "_(" + autor.username + "#" + autor.discriminator + ")_")
  console.log(q)
 })   
if (test === []) {
   ctx.sendMessage("Não há mais nada na fila")
}
console.log(test.length)
if (test.length > 50) test.slice(0, 50)

 const quebed = new this.client.embed()
.setTitle("Lista de musicas") 
.setDescription(test.join("\n"))
.setColor("GREEN")
.setFooter(ctx.author.username + "#" + ctx.author.discriminator)
.setTimestamp()
ctx.sendMessage({embed: quebed})

  }}