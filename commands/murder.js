const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('murder')
		.setDescription('Murders'),
	helpMessage: 'murder',
	async execute() {
		return '🗡️🔪'.repeat(200);
	},
};