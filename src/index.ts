import { AutocompleteInteraction, ChatInputCommandInteraction, Client, Collection, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import config from '../cfg/config.json';
import fs from 'fs';

// const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

const arrCommandData = [];
const commands: Collection<string, (interaction: ChatInputCommandInteraction) => Promise<void | string>> = new Collection();
const autocomplete: Collection<string, (interaction: AutocompleteInteraction) => Promise<void>> = new Collection();
const eventFiles = fs.readdirSync('./src/events').filter((file: string) => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./src/commands').filter((file: string) => file.endsWith('.js'));

interface Command {
	data: SlashCommandBuilder,
	isDefered?: boolean,
	isDMAllowed?: boolean,
	isAdmin?: boolean,
	execute: (interaction: ChatInputCommandInteraction) => Promise<void | string>,
	autocomplete: (interaction: AutocompleteInteraction) => Promise<void>,
}

for (const file of commandFiles) {
	console.log(`Loading Module ${file}`);
	const command = require(`./commands/${file}`);

	arrCommandData.push(command.data);
	commands.set(command.data.name, command.execute);

	if (command.autoComplete) autocomplete.set(command.data.name, command.autoComplete);
}

import chatInputCommandEvent from './events/chatInputCommand';
import autocompleteCommandEvent from './events/autocomplete';
import guildMemberAddEvent from './events/guildMemberAdd';
import messageCreateEvent from './events/messageCreate';

client.on(chatInputCommandEvent.type, (interaction: ChatInputCommandInteraction) => {
	chatInputCommandEvent.execute(interaction, commands);
});

client.on(autocompleteCommandEvent.type, (interaction: AutocompleteInteraction) => {
	autocompleteCommandEvent.execute(interaction, autocomplete);
});

client.on(guildMemberAddEvent.type, guildMemberAddEvent.execute);
client.on(messageCreateEvent.type, messageCreateEvent.execute);

for (const file of eventFiles) {
	console.log(`Loading event module: ${file}`);
	const module = require(`./events/${file}`);

	if (module.once) {
		client.once(module.type, module.execute);
	}
	else {
		client.on(module.type, module.execute);
	}
}

require('./deploy')(arrCommandData)
	.then(() => {
		client.login(config['token']);
	})
	.catch(console.error);