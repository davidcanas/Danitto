/* ALGUMAS COISAS FORAM INSIPARADAS NO CÓDIGO DE davidffa/D4rkBot */
import fs from "fs";
import {
  ApplicationCommandOption,
  ApplicationCommandStructure,
  Client,
  ClientOptions,
  Guild,
  User,
} from "eris";
import { Command, Utils } from "../typings/index";
import botDB from "../models/botDB";
import guildDB from "../models/guildDB";
import cmds from "../models/cmds";
import users from "../models/userDB";
import Embed from "./Embed";
import levenshteinDistance from "../utils/levenshteinDistance";
import { NodeOptions } from "vulkava";
import Music from "./Music";
import {
  ComponentCollector,
  MessageCollector,
  ReactionCollector,
} from "./Collector";
import fetch from "node-fetch";
import reminderDB from "../models/reminderDB";

export default class DaniClient extends Client {
  commands: Array<Command>;
  music: Music;
  db: {
    bot: typeof botDB;
    guild: typeof guildDB;
    cmds: typeof cmds;
    users: typeof users;
    reminder: typeof reminderDB;
  };
  utils: Utils;
  fetch: typeof fetch;
  embed: typeof Embed;
  owner: User;
  allowedUsers: Array<String>;
  messageCollectors: Array<MessageCollector>;
  componentCollectors: Array<ComponentCollector>;
  reactionCollectors: Array<ReactionCollector>;
  constructor(token: string) {
    const clientOptions: ClientOptions = {
      allowedMentions: {
        everyone: false,
      },
      intents: 32767,
      getAllUsers: true,
      restMode: true,
      defaultImageFormat: "png",
      defaultImageSize: 2048,
    };

    super(token, clientOptions);
    this.commands = [];
    this.db = {
      bot: botDB,
      guild: guildDB,
      cmds: cmds,
      users: users,
      reminder: reminderDB,
    };
    this.utils = {
      levDistance: levenshteinDistance,
    };
    this.fetch = fetch;
    this.embed = Embed;
    this.messageCollectors = [];
    this.componentCollectors = [];
    this.reactionCollectors = [];
    this.owner = this.users.get("733963304610824252");
    this.allowedUsers = [
      "733963304610824252",
      "718078381199065150",
      "746048815504687124",
    ];
  }

  async findUser(param: string, guild: Guild | null): Promise<User | null> {
    let user: User | null | undefined;

    const matched = param.match(/<@!?(\d{17,18})>/);

    if (matched) {
      try {
        user =
          this.users.get(matched[1]) || (await this.getRESTUser(matched[1]));
      } catch {}
    } else if (/\d{17,18}/.test(param)) {
      try {
        user = this.users.get(param) || (await this.getRESTUser(param));
      } catch {}
    }

    if (!guild) return null;

    if (!user) {
      const usernameRegex = /(.+)?#(\d{4})/;
      const match = param.match(usernameRegex);

      if (match) {
        if (match[1])
          user = guild.members.find(
            (m) => m.username === match[1] && m.user.discriminator === match[2]
          )?.user;
        else
          user = guild.members.find(
            (m) => m.user.discriminator === match[2]
          )?.user;
      }
    }

    if (!user) {
      const lowerCaseParam = param.toLowerCase();
      let startsWith = false;

      for (const m of guild.members.values()) {
        if (
          (m.nick &&
            (m.nick === param ||
              m.nick.toLowerCase() === param.toLowerCase())) ||
          m.username === param ||
          m.username.toLowerCase() === param.toLowerCase()
        ) {
          user = m.user;
          break;
        }

        if (
          (m.nick && m.nick.startsWith(lowerCaseParam)) ||
          m.username.toLowerCase().startsWith(lowerCaseParam)
        ) {
          user = m.user;
          startsWith = true;
          continue;
        }

        if (
          !startsWith &&
          ((m.nick && m.nick.toLowerCase().includes(lowerCaseParam)) ||
            m.username.toLowerCase().includes(lowerCaseParam))
        ) {
          user = m.user;
        }
      }
    }
    return user || null;
  }
  connect(): Promise<void> {
    return super.connect();
  }
  loadCommands(): void {
    fs.readdirSync("./src/commands").forEach((folder) => {
      fs.readdirSync(`./src/commands/${folder}`).forEach((file) => {
        const DaniCommand = require(`../commands/${folder}/${file}`).default;
        this.commands.push(new DaniCommand(this));
      });
    });

    this.bulkEditCommands(
      this.commands as unknown as ApplicationCommandStructure[]
    );
    console.log("Os comandos foram carregados.");
  }
  loadEvents(): void {
    fs.readdirSync("./src/events").forEach((f) => {
      const DaniEvent = new (require(`../events/${f}`).default)(this);
      const eventName = f.split(".")[0];

      if (eventName === "ready") {
        super.once("ready", (...args) => DaniEvent.run(...args));
      } else {
        super.on(eventName, (...args) => DaniEvent.run(...args));
      }
    });
    console.log("OS eventos foram carregados.");
  }
  connectLavaLink(): void {
    const nodes: NodeOptions[] = [
      {
        id: "Danitto Frankfurt Node",
        hostname: process.env.LAVALINKURL as string,
        port: 80,
        password: process.env.LAVALINKPASSWORD as string,
        maxRetryAttempts: 10,
        retryAttemptsInterval: 3000,
        secure: false,
      },
      {
        id: "Danitto Washington Node",
        hostname: process.env.LAVALINKURL1 as string,
        port: 80,
        password: process.env.LAVALINKPASSWORD as string,
        maxRetryAttempts: 10,
        retryAttemptsInterval: 3000,
        secure: false,
      },
      {
        id: "Danitto Moscovo Node",
        hostname: process.env.LAVALINKURL2 as string,
        port: 80,
        password: process.env.LAVALINKPASSWORD as string,
        maxRetryAttempts: 10,
        retryAttemptsInterval: 3000,
        secure: false,
      },
    ];

    this.music = new Music(this, nodes);

    this.music.init();
    super.on("rawWS", (packet) => this.music.handleVoiceUpdate(packet));
  }

  createReminder({ timeMS, text, userID, channelID }) {
    const now = Date.now();
    const when = now + timeMS;

    console.log(when);

    return this.db.reminder.create({
      _id: now,
      when,
      text: text,
      userID: userID,
      channelID: channelID,
    });
  }

  async getReminders() {
    let arr = await this.db.reminder.find({});

    return arr;
  }

  async deleteReminder(reminderID) {
    await this.db.reminder.findOneAndDelete({ _id: reminderID });
    return "Deleted";
  }

  async checkReminders() {
    const reminders = await this.getReminders();
    for (const reminder of reminders) {
      if (parseInt(reminder.when) < Date.now()) {
        let user = this.users.get(reminder.userID);
        let dm = await user.getDMChannel();
        dm.createMessage(
          `${user.username},pediste-me para te lembrar de **${reminder.text}**`
        );
        this.deleteReminder(reminder._id);
      }
      if (isNaN(parseInt(reminder.when))) {
        this.deleteReminder(reminder._id);
      }
    }

    setTimeout(() => this.checkReminders(), 60000);
  }
}
