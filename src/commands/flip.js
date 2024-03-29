const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flip a coin'),
	helpMessage: '',
	async execute() {
		const coin = Math.floor(Math.random() * 2);
		return ((coin) ? 'Heads' : 'Tails');
	},
};