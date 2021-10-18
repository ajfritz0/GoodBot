const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flips a coin'),
	async execute(interaction) {
		const coin = Math.floor(Math.random() * 2);
		await interaction.reply((coin) ? 'Heads' : 'Tails');
	},
};