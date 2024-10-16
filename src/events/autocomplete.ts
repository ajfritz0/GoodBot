import type { AutocompleteInteraction, Collection } from "discord.js";

// eslint-disable-next-line no-unused-vars
import { Events } from 'discord.js';
import type { BotEvent } from "../Interfaces";

const autocomplete: BotEvent = {
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
export default autocomplete;