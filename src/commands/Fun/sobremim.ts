import Command from "../../structures/Command"
import Client from "../../structures/Client"
import CommandContext from "../../structures/CommandContext"

export default class AboutMe extends Command {
	constructor(client: Client) {
		super(client, {
			name: "sobremim",
			description: "Vê o perfil de um usuario!",
			category: "Fun",
			aliases: ["aboutme"],
			options: [{
				name: 'texto',
				type: 3,
				description: 'O texto para atualizar seu sobremim.',
				required: true
			}]

		})
	}

	async execute(ctx: CommandContext): Promise<void> {
		const user = ctx.author.id
		let userDB = await this.client.db.users.findOne({ _id: user })
		if (!userDB) {
			await this.client.db.users.create({
				_id: user,
				user: {
					id: user,
					username: this.client.users.get(user).username,
				}

			})
			userDB = await this.client.db.users.findOne({ _id: user })

		}
		if (ctx.args.join(" ").length > 100) {
			ctx.sendMessage("Seu sobremim não pode ter mais de 100 caracteres!")
			return
		}
		if (ctx.args.join(" ") === "") {
			ctx.sendMessage("Seu sobremim não pode ser vazio!")
			return
		}
		userDB.profile.sobremim = ctx.args.join(" ")
		userDB.save()
		ctx.sendMessage("Seu sobremim foi atualizado com sucesso para " + ctx.args.join(" ") + " !") //a
	}
}