// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { CurrencyShop } = require('../dbObjects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Display Shop'),
	/**
	 *
	 * @returns {string}
	 */
	async execute() {
		const items = await CurrencyShop.findAll();
		return codeBlock(
			items.map(i => `${i.name}: ${i.cost} points`).join('\n'),
		);
	},
};