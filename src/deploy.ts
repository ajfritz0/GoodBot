import type { SlashCommandBuilder } from "discord.js";

import { REST, Routes } from 'discord.js';
import { token, clientId, guildId } from '../cfg/config.json';
import { SlashCommand } from "./Interfaces";

export default async (commandData: SlashCommand[]) => {
	const args = process.argv.slice(2);
	const rest = new REST({ version: '10' }).setToken(token);

	if (args.includes('--no-deploy')) return;

	try {
		console.log('Deploying Application Commands');
		let data: Array<any>;
		if (args.includes('--dev')) {
			data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commandData },
			) as Array<any>;
		}
		else {
			data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commandData },
			) as Array<any>;
		}

		console.log(`Successfully reloaded ${data.length} application commands`);
	}
	catch (error) {
		console.error(error);
	}
};