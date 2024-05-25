// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, codeBlock } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Points Leaderboard'),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {string}
	 */
	async execute(interaction) {
		return codeBlock(
			interaction.client.exchange.currency.sort((a, b) => b.balance - a.balance)
				.filter(user => interaction.client.users.cache.has(user.user_id))
				.first(10)
				.map((user, pos) => `(${pos + 1}) ${(interaction.client.users.cache.get(user.user_id).tag)}: ${user.balance}`)
				.join('\n'),
		);
	},
};