import { Client, Collection, SlashCommandBuilder, type Awaitable, type ClientOptions } from "discord.js";

interface SlashCommand {
	data: SlashCommandBuilder,
	helpMessage: string,
	execute: Function,
	autoComplete?: Function,
}

class BotClient extends Client {
	commands: Collection<string, Promise<void>>;
	autocomplete: Collection<string, Promise<void>>;
	constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection();
		this.autocomplete = new Collection();
	}

	getCommand(commandName: string): Promise<void> | void {
		return this.commands.get(commandName);
	}

	setCommand(commandName: string, cb: Promise<void>): void {
		this.commands.set(commandName, cb);
	}

	addAutocomplete(commandName: string, cb: Promise<void>): void {
		this.autocomplete.set(commandName, cb);
	}
}

export default BotClient;