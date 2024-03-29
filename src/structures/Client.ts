/* ALGUMAS COISAS FORAM INSIPARADAS NO CÓDIGO DE davidffa/D4rkBot */
import fs from "fs";
import {
  Client,
  ClientOptions,
  Constants,
  Guild,
  User,
  ApplicationCommand,
  ClientEvents,
} from "oceanic.js";

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

import path from "path";

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
      auth: token,
      defaultImageFormat: 'png',
      defaultImageSize: Constants.MAX_IMAGE_SIZE,
      gateway: {
        getAllUsers: true,
        intents: [
          'GUILDS',
          'GUILD_MEMBERS',
          'GUILD_EMOJIS_AND_STICKERS',
          'GUILD_VOICE_STATES',
          'GUILD_PRESENCES',
          'GUILD_MESSAGES',
          'MESSAGE_CONTENT',
        ]
      },
      collectionLimits: {
        messages: 10
      }
    };

    super(clientOptions);
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
      "334054158879686657",
    ];
  }
  async findUser(param: string, guild: Guild | null): Promise<User | null> {
    let user: User | null | undefined;

    const matched = param.match(/<@!?(\d{17,18})>/);

    if (matched) {
      try {
        user =
          this.users.get(matched[1]) || (await this.rest.users.get(matched[1]));
      } catch {}
    } else if (/\d{17,18}/.test(param)) {
      try {
        user = this.users.get(param) || (await this.rest.users.get(param));
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
    for (const dir of fs.readdirSync(
      path.resolve(__dirname, "..", "commands")
    )) {
      if (dir.endsWith(".ts") || dir.endsWith(".js")) {
        const cmd = require(`../commands/${dir}`).default;
        this.commands.push(new cmd(this));
      } else {
        for (const file of fs.readdirSync(
          path.resolve(__dirname, "..", "commands", dir)
        )) {
          if (file.endsWith(".ts") || file.endsWith(".js")) {
            const command = require(`../commands/${dir}/${file}`).default;
            this.commands.push(new command(this));
          }
        }
      }
    }

    console.log("Os comandos foram carregados.");
  }
  loadEvents(): void {
    for (const file of fs.readdirSync(
      path.resolve(__dirname, "..", "events")
    )) {
      if (file.endsWith(".ts") || file.endsWith(".js")) {
        const event = new (require(`../events/${file}`).default)(this);
        const eventName = file.split(".")[0] as keyof ClientEvents;
        
        if (eventName === "ready") {
          super.once("ready", (...args) => event.run(...args));
        } else {
          super.on(eventName, (...args) => event.run(...args));
        }
      }
    }
  }
  updateSlash(): void {
    let cmds = Array();
    let map = Array.from(this.commands);
    for (let command of Object(map)) {
      cmds.push({
        name: command.name,
        description: command.description,
        options: command.options,
        type: command.type || 1,
      });
    }
    this.application.bulkEditGlobalCommands(cmds);
    console.log("Os slashs foram atualizados");
  }
  connectLavaLink(): void {
    const nodes: NodeOptions[] = [
      {
        id: "Danitto Ohio Node",
        hostname: process.env.LAVALINKURL as string,
        port: 2333,
        password: process.env.LAVALINKPASSWORD as string,
        maxRetryAttempts: 10,
        retryAttemptsInterval: 3000,
        region: "USA",
        secure: false,
      },
     /* {
        id: "Danitto Lisboa Node",
        hostname: process.env.LAVALINKURL1 as string,
        port: 2333,
        password: process.env.LAVALINKPASSWORD as string,
        maxRetryAttempts: 10,
        retryAttemptsInterval: 3000,
        region: "EU",
        secure: false,
      },*/	
    ];

    this.music = new Music(this, nodes);

    this.music.init();
    super.on("packet", (packet) => this.music.handleVoiceUpdate(packet));
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
        let dm = await user.createDM();
        dm.createMessage({content:`${user.username},pediste-me para te lembrar de **${reminder.text}**`});
        this.deleteReminder(reminder._id);
      }
      if (isNaN(parseInt(reminder.when))) {
        this.deleteReminder(reminder._id);
      }
    }

    setTimeout(() => this.checkReminders(), 80000);
  }
}
