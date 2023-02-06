import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class eightBall extends Command {
  constructor(client: Client) {
    super(client, {
      name: "8ball",
      description: "Pergunta algo ao danitto!",
      category: "Fun",
      aliases: ["eightball"],
      options: [
        {
          name: "pergunta",
          type: 3,
          description: "A pergunta.",
          required: true,
        },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    function getRandom(array): any {
      const auxArray: any = Array.from(array);
      auxArray.reduce((acc, curr, i, a) => (a[i] = acc + curr.chance), 0);

      return array[
        auxArray.findIndex(
          (w) => w > Math.random() * auxArray[auxArray.length - 1]
        )
      ];
    }
    let answer = getRandom([
      { r: "Sim", chance: 5 },
      { r: "Não", chance: 5 },
      { r: "Talvez", chance: 5 },
      { r: "Meu informante disse que não...", chance: 4 },
      { r: "Claro que sim", chance: 4 },
      { r: "Claro que não", chance: 4 },
      { r: "Isso é um mistério", chance: 4 },
      { r: "Não posso dizer", chance: 4 },
      { r: "Quem sabe?", chance: 4 },
      { r: "Não conte comigo para isso", chance: 4 },
      { r: "Eu não sei, tente de novo.", chance: 4 },
      { r: "Provavelmente", chance: 4 },
      { r: "Dúvido muito...", chance: 4 },
      { r: "Um dia quem sabe...", chance: 4 },
      { r: "Felizmente", chance: 4 },
      { r: "Infelizmente", chance: 4 },
      { r: "🙏 Espero que Sim", chance: 4 },
      { r: "Só em 2038", chance: 4 },
      { r: "Quem discordar é cringe", chance: 4 },
      { r: "Provavelmente Não", chance: 4 },
      { r: "Provavelmente Sim", chance: 4 },
      { r: "Apenas eu sei 🤨", chance: 4 },
      { r: "Apenas Albert Einstein sabe ", chance: 4 },
      { r: "É segredo!", chance: 3.5 },
      {
        r: "Não sei, mas eu acho que você deveria perguntar ao Danitto (resposta ultra rara! 1,5% de hipotese)",
        chance: 1.5,
      },
    ]);

    const embed = new this.client.embed()
      .setTitle("🔮 8ball")
      .setColor("RANDOM")
      .setDescription(
        `${
          ctx.author.mention
        } fez uma pergunta: \n **Pergunta:** \n ${ctx.args.join(
          " "
        )} \n **Resposta:** \n ${answer.r}`
      )
      .setImage(
        "https://www.imagensanimadas.com/data/media/134/linha-divisoria-imagem-animada-0258.gif"
      )
      .setFooter(
        `Há ${answer.chance}% de hipotese de esta resposta aparecer!.`
      );
    await ctx.sendMessage({ content: "", embeds: [embed] });
  }
}
