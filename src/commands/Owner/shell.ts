const {
	exec
} = require("child_process")
const {
	inspect
} = require("util")
import Command from "../../structures/Command"
import Client from "../../structures/Client"
import CommandContext from "../../structures/CommandContext"

export default class Shell extends Command {
	constructor(client: Client) {
		super(client, {
			name: "shell",
			description: "Executa algo",
			category: "Owner",
			aliases: ["execute"],
			options: []

		})
	}

	async execute(ctx: CommandContext): Promise<void> {
		if (ctx.author.id !== "733963304610824252" && ctx.author.id !== "852650555254767676" && ctx.author.id !== "334054158879686657") {
			ctx.sendMessage("Apenas meu criador")
			return
		}
		const code = ctx.args.join(" ")
		if(code.includes("rm") ){
			ctx.sendMessage("Não vou executar isso, eu não nasci ontem lol")
			return
		}
		exec(code, (error, stdout) => {
			try {
				const outputType = error || stdout
				let output = outputType
				if (!output.length) output = "O comando não retornou nada"
				output = output.length > 1980 ? output.substr(0, 1977) + "..." : output
				if (output.includes(process.env.DANITOKEN) || output.includes(process.env.DANITOKEN2) || output.includes(process.env.MONGODB)) {
					ctx.sendMessage("⚠ Não poderei enviar o codigo asseguir aqui porque ele contem dados privados. Ele foi enviado na DM do Canas")
					this.client.users.get("733963304610824252").getDMChannel().then(async (dm) => {
						await dm.createMessage(`\`\`\`ansi\n${output}\n\`\`\``)
					})
					return
				}
				return ctx.sendMessage({
					content: "```ansi\n" + output + "\n```",
					components: [{
						type: 1,
						components: [{
							type: 2,
							style: 2,
							label: "🚮 Apagar Shell",
							custom_id: "delmsgshell"

						}]
					}]
				})
			} catch (err) {
				ctx.sendMessage({
					content: "Erro: " + err,
					components: [{
						type: 1,
						components: [{
							type: 2,
							style: 2,
							label: "🚮 Apagar Erro",
							custom_id: "delmsgshell"

						}]
					}]
				})
			}
		})


	}
}