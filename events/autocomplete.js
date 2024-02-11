// eslint-disable-next-line no-unused-vars
const { Events, CommandInteraction } = require('discord.js');

module.exports = {
	type: Events.InteractionCreate,
	once: false,
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		if (!interaction.isAutocomplete()) return;

		const command = interaction.client.autoComplete.get(interaction.commandName);
		if (!command) return;

		try {
			await command(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply('Error executing autocomplete');
		}
	},
};