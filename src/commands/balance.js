// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Account balance'),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {string}
	 */
	async execute(interaction) {
		const target = interaction.user.id;
		return interaction.client.exchange.getBalance(target).toString();
	},
};