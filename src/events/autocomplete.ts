import type { AutocompleteInteraction, Collection } from "discord.js";

// eslint-disable-next-line no-unused-vars
const { Events } = require('discord.js');

export default {
	type: Events.InteractionCreate,
	once: false,
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction: AutocompleteInteraction, autocompleteData: Collection<string, (cmdInteraction: AutocompleteInteraction) => Promise<void>>) {
		if (!interaction.isAutocomplete()) return;

		const command = autocompleteData.get(interaction.commandName);
		if (!command) return;

		try {
			await command(interaction);
		}
		catch (error) {
			console.error(error);
		}
	},
};