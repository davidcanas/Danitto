import Client from "./Client";
import { CommandSettings } from "../typings";
export default class Command implements CommandSettings {
  client: Client;
  description: string;
  name: string;
  aliases?: Array<string>;
  category: "Owner" | "Util" | "Info" | "Fun" | "Music";
  options: Array<Object>;
  type: number;
  constructor(client: Client, options: CommandSettings) {
    this.client = client;
    this.name = options.name;
    this.description = options.description || "Sem descrição de momento";
    this.aliases = options.aliases;
    this.category = options.category;
    this.options = options.options;
    this.type = 1;
  }
}
