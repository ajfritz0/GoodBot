const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flip a coin'),
	helpMessage: '',
	async execute(interaction) {
		const coin = Math.floor(Math.random() * 2);
		await interaction.reply((coin) ? 'Heads' : 'Tails');
	},
};