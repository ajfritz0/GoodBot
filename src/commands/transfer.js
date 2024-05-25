// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transfer')
		.setDescription('Transfer funds from one person to another')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Guild Member')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Amount')
				.setRequired(true),
		),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const ex = interaction.client.exchange;
		const transferAmount = interaction.options.getInteger('amount');
		const transferTarget = interaction.options.getUser('user');

		const status = ex.transfer(interaction.user.id, transferTarget.id, transferAmount);

		if (status instanceof Error) return status.message;
		else return 'Transaction complete';
	},
};