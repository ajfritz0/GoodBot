// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { CurrencyShop, Users } = require('../dbObjects');
const { Op } = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy Items')
		.addStringOption(option =>
			option.setName('item')
				.setDescription('Item Name'),
		),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {string}
	 */
	async execute(interaction) {
		const itemName = interaction.options.getString('item');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
		const userBalance = interaction.client.exchange.getBalance(interaction.user.id);

		if (!item) return 'That item does not exist';
		if (item.cost > userBalance) return `You currently have ${userBalance} points, but ${item.name} costs ${item.cost} points`;

		const user = await Users.findOne({ where: { user_id: interaction.user.id } });
		interaction.client.exchange.addBalance(interaction.user.id, -item.cost);
		await user.addItem(item);

		return `You've bought: 1 ${item.name}`;
	},
};