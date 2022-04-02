import Command from "../../structures/Command"
import Client from "../../structures/Client"
import CommandContext from "../../structures/CommandContext"

export default class Profile extends Command {
	constructor(client: Client) {
		super(client, {
			name: "profile",
			description: "Vê o perfil de um usuario!",
			category: "Fun",
			aliases: ["perfil"],
			options: [{
				name: 'user',
				type: 3,
				description: 'Caso queira ver o perfil de um usuario diferente de você.',
				required: false
			}]

		})
	}

	async execute(ctx: CommandContext): Promise<void> {
		let user;
		if (ctx.args[0]) {
			user = await this.client.findUser(ctx.args.join(' '), ctx.guild);
		} else {
			user = ctx.author
		}
		console.log(user)
		let userDB = await this.client.db.users.findOne({ _id: user.id })
		if (!userDB) {
			await this.client.db.users.create({
				_id: user.id,
				user: {
					id: user.id,
					username: this.client.users.get(user.id).username,
				}

			})
			userDB = await this.client.db.users.findOne({ _id: user.id })

		}
		const userVerified = ["305532760083398657", "733963304610824252", "722207631112142909", "334054158879686657", "746048815504687124", "718078381199065150", "852650555254767676"]
		const verificado = userVerified.includes(user.id)

		const embed = new this.client.embed()
		if (!verificado) {
			embed.setTitle(`Perfil de ${this.client.users.get(user.id).username}`)
			embed.setFooter("Danitto © Todos os direitos reservados.")
		} else {
			embed.setTitle(`Perfil de ${this.client.users.get(user.id).username} <:usuario_verificado_pela_equipe:942515716572213309>`)
			embed.setFooter("Este usuario foi verificado e aprovado pelo CanasDev Verificações TM")
		}
		embed.setURL(`https://danitto.live/perfil/${user.id}`)
		embed.addField(" 💸 Dinheiro", `${userDB.profile.money}`)
		embed.addField(" 📜 Sobremim", `${userDB.profile.sobremim}`)
		embed.addField(" 🌟 Badges", `${userDB.profile.badges} ⠀`)
		embed.setColor("RANDOM")
		embed.setThumbnail(this.client.users.get(user.id).avatarURL)


		//c
		ctx.sendMessage({
			embeds: [embed]
		})

	}
}