import { Events, AutocompleteInteraction, ChatInputCommandInteraction, Client, Collection, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import config from '../cfg/config.json';
import fs from 'fs';
import type { BotCommand } from './Interfaces';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

const arrCommandData = [];
const commands: Collection<string, (interaction: ChatInputCommandInteraction) => Promise<void | string>> = new Collection();
const autocomplete: Collection<string, (interaction: AutocompleteInteraction) => Promise<void>> = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter((file: string) => file.endsWith('.js'));

for (const file of commandFiles) {
	console.log(`Loading Module ${file}`);
	const command: BotCommand = require(`./commands/${file}`);

	arrCommandData.push(command.data);
	commands.set(command.data.name, command.execute);

	if (command.autocomplete) autocomplete.set(command.data.name, command.autocomplete);
}

import chatInputCommandEvent from './events/chatInputCommand';
import autocompleteCommandEvent from './events/autocomplete';
import guildMemberAddEvent from './events/guildMemberAdd';
import messageCreateEvent from './events/messageCreate';
import readyEvent from './events/clientReady';

client.on(chatInputCommandEvent.type, (interaction: ChatInputCommandInteraction) => {
	chatInputCommandEvent.execute(interaction, commands);
});
client.on(autocompleteCommandEvent.type, (interaction: AutocompleteInteraction) => {
	autocompleteCommandEvent.execute(interaction, autocomplete);
});
client.on(guildMemberAddEvent.type, guildMemberAddEvent.execute);
client.on(messageCreateEvent.type, messageCreateEvent.execute);
client.once(readyEvent.type, readyEvent.execute);
client.on(Events.CacheSweep, () => console.log('ping'));

require('./deploy')(arrCommandData)
	.then(() => {
		client.login(config['token']);
	})
	.catch(console.error);