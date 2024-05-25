// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { Users } = require('../dbObjects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('Show Inventory'),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {string}
	 */
	async execute(interaction) {
		const userId = interaction.user.id;
		console.log(`LOG: userId = ${userId}`);
		const user = await Users.findOne({ where: { user_id: userId } });
		const items = await user.getItems();

		if (!items.length) return '[Empty]';
		return `[Inventory]\n${items.map(i => `${i.item.name} (${i.amount})`)}`;
	},
};