import Command from "../../structures/Command";
import Client from "../../structures/Client";
import CommandContext from "../../structures/CommandContext";

export default class eightBall extends Command {
  constructor(client: Client) {
    super(client, {
      name: "ship",
      description: "Qual a chance de um casal dar certo?",
      category: "Fun",
      aliases: [],
      options: [
        {
          name: "primeira_pessoa",
          type: 3,
          description: "A primeira pessoa a shippar",
          required: true,
        },
        {
            name: "segunda_pessoa",
            type: 3,
            description: "A primeira pessoa a shippar",
            required: true,
          },
      ],
    });
  }

  async execute(ctx: CommandContext): Promise<void> {

  if (!ctx.args[0] || !ctx.args[1]) {
    ctx.sendMessage("Precisar inserir dois nomes para shippar!\nExemplo:\n```\n/ship primeira_pessoa:João segunda_pessoa:Maria\n```")
    return;
  }
 
  function getLovePercentage(name1, name2) {
    let concat = [name1, name2].sort((a,b) => a.localeCompare(b)).join('').toLowerCase()
    let counter = ''
    while(concat.length) {
      counter += concat.match(new RegExp(concat[0], 'gi')).length
      concat = concat.split('').filter(c => c !== concat[0]).join('')
    }
    return +_reduce(counter)
  }
  
  function _reduce(counter) {
    let result = 0
    while(counter.length >= 2) {
      result += (+counter[0] + (+counter[counter.length-1]))
      counter = counter.substring(1, counter.length-1)
    }
    result += counter
    return result <= 100 ? result : _reduce(result)
  }
   ctx.sendMessage(`A chance de ${ctx.args[0]} e ${ctx.args[1]} darem certo é de ${getLovePercentage(ctx.args[0], ctx.args[1])}`)

  }}