/*                                   THX D4RKB     :)                                                       */
import Client from "./Client";
import {
  Attachment,
  CommandInteraction,
  Guild,
  InteractionDataOptionWithValue,
  Member,
  Message,
  MessageContent,
  TextableChannel,
  User,
} from "eris";

export enum Type {
  MESSAGE,
  INTERACTION,
}

export default class CommandContext {
  private readonly client: Client;
  private readonly interactionOrMessage: Message | CommandInteraction;
  private deferred: boolean;

  public type: Type;
  public args: string[] = [];
  public attachments: Attachment[];

  constructor(
    client: Client,
    interaction: Message | CommandInteraction,
    args: string[] = []
  ) {
    this.client = client;
    this.interactionOrMessage = interaction;

    if (interaction instanceof Message) {
      this.type = Type.MESSAGE;

      this.args = args;
      this.attachments = interaction.attachments;
    } else {
      this.type = Type.INTERACTION;

      if (interaction.data.type === 1) {
        if (interaction.data.options?.[0].type === 1) {
          this.args.push(interaction.data.options[0].name.toString().trim());

          for (const val of interaction.data.options[0]
            .options as InteractionDataOptionWithValue[]) {
            this.args.push(val.value.toString().trim());
          }
        } else {
          const options = interaction.data
            .options as InteractionDataOptionWithValue[];

          this.args = options?.map((ops) => ops.value.toString().trim()) ?? [];
        }
      } else if (interaction.data.type === 2) {
        this.args.push(interaction.data.target_id!);
      } else if (interaction.data.type === 3) {
        this.args = interaction.data
          .resolved!.messages!.get(interaction.data.target_id!)!
          .content.split(/ +/);
      }
    }
  }
  get msg(): Message | CommandInteraction {
    return this.interactionOrMessage;
  }
  get author(): User {
    if (this.interactionOrMessage instanceof Message)
      return this.interactionOrMessage.author;
    return this.interactionOrMessage.member!.user;
  }

  get member(): Member | null | undefined {
    return this.interactionOrMessage.member;
  }

  get guild(): Guild {
    return this.client.guilds.get(this.interactionOrMessage.guildID!)!;
  }

  get channel(): TextableChannel {
    return this.interactionOrMessage.channel;
  }
  async sendMessage(
    content: MessageContent,
    fetchReply = false
  ): Promise<Message<TextableChannel> | void> {
    if (this.interactionOrMessage instanceof Message) {
      if(this.channel.type !== 0) {
      await (await this.author.getDMChannel()).createMessage(content)
      return
      }
       console.log(this.channel)
      return this.channel.createMessage(content);
    } else {
      if (this.deferred) {
        await this.interactionOrMessage.editOriginalMessage(content);
      } else {
        await this.interactionOrMessage.createMessage(content);
      }

      if (fetchReply) {
        return this.interactionOrMessage.getOriginalMessage();
      }
    }
  }
  errorEmbed(title: string) {
    let embed = new this.client.embed()
      .setTitle("❌ Ocorreu um erro")
      .setDescription(title)
      .setColor("ff0000");
    this.sendMessage({ content: "", embeds: [embed], flags: 1 << 6 });
  }
  async createBin(sourcebin, data, language) {
    const bin = await sourcebin.create(
      [
        {
          content: data,
          language: language,
        },
      ],
      {
        title: "Danitto SourceBin",
        description: "Sourcebin created by Danitto",
      }
    );
    return bin;
  }
  MsToDate(time) {
    if (!time) return "No time provided";
    if (isNaN(time)) return "The time provided is not a number ! ";
    time = Math.round(time / 1000);

    const s = time % 60,
      m = ~~((time / 60) % 60),
      h = ~~((time / 60 / 60) % 24),
      d = ~~(time / 60 / 60 / 24);

    return `${d}D:${h}H:${m}M:${s}S`;
  }
  async defer() {
    if (this.interactionOrMessage instanceof CommandInteraction) {
      this.interactionOrMessage.defer();
      this.deferred = true;
    }
  }
}
