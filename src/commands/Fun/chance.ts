import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class eightBall extends Command {
  constructor(client: Client) {
    super(client, {
      name: "chance",
      description: "Qual a chance de tal coisa acontecer ou ser verdade? hm hm",
      category: "Fun",
      aliases: [],
      options: [
        {
          name: "pergunta",
          type: 3,
          description: "A pergunta para eu descobrira chance de ocorrer ",
          required: true,
        },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {
    if (!ctx.args[0]) {
      ctx.sendMessage("Precisar inserir um argumento válido!");
      return;
    }
    if (ctx.args[0].includes("everyone")) {
        ctx.sendMessage("Não posso executar o comando devido ao argumento referido ser potencialmente perigoso")
    }
    if (ctx.args[0].length > 100) {
      ctx.sendMessage("A pergunta não pode ser tão grande assim.");
    }
    function gerarPercentagem() {
      return Math.floor(Math.random() * 100) + 1 + "%";
    }

    ctx.sendMessage(
      `A chance de ${ctx.args[0]} ser verdade é de ${gerarPercentagem()}`
    );
  }
}
