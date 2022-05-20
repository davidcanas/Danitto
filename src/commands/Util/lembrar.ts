import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";
import { isThisTypeNode } from "typescript";

export default class Lembrar extends Command {
  constructor(client: Client) {
    super(client, {
      name: "lembrar",
      description: "Cria um lembrete",
      category: "Util",
      aliases: ["remindme", "lembrete"],
      options: [
        {
          name: "tempo",
          type: 3,
          description: "O tempo para lembrar (ex : 70s/9h....) (minimo: 60s)",
          required: true,
        },
        {
          name: "mensagem",
          type: 3,
          description: "A mensagem do lembrete",
          required: true,
        },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {

    var time = ctx.args[0];
    var mensagem = ctx.args.splice(1).join(" ");

    if (!time) {
      ctx.sendMessage(
        "Qual é o tempo? Pode ser [s/m/h/d], o minimo é 60 segundos"
      );
      return;
    }
    if (!mensagem) {
      ctx.sendMessage("Tens que inserir alguma mensagem para o teu lembrete.");
      return;
    }

    time = await time.toString();

    if (time.indexOf("s") !== -1) {
      // Segundos
      var timesec = await time.replace(/s.*/, "");
      if (+timesec <= 59) {
        ctx.sendMessage("O tempo deve ser superior a 1 minuto ");
        return;
      }
      var timems = +timesec * 1000;
    } else if (time.indexOf("m") !== -1) {
      // Minutos
      var timemin = await time.replace(/m.*/, "");
      timems = +timemin * 60 * 1000;
    } else if (time.indexOf("h") !== -1) {
      // Horas
      var timehour = await time.replace(/h.*/, "");
      timems = +timehour * 60 * 60 * 1000;
    } else if (time.indexOf("d") !== -1) {
      // Dias
      var timeday = await time.replace(/d.*/, "");
      timems = +timeday * 60 * 60 * 24 * 1000;
    } else {
      ctx.sendMessage("O formato do tempo deve ser `[s/m/h/d]`");
      return
 }
    try {
      this.client.createReminder({
        timeMS: timems,
        text: mensagem,
        userID: ctx.author.id,
        channelID: ctx.channel.id,
      });
      ctx.sendMessage(
        `Vou te lembrar de \`${mensagem}\` daqui a ${time}\nA mensagem será enviada  no teu **privado** certifica-te que o tens aberto. `
      );
    } catch (err) {
      ctx.sendMessage(`Ocorreu um erro:\n${err}`);
      console.log(err);
    }
  }
}
