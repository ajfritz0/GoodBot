const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffles the playlist queue'),
	async execute(interaction) {
		return interaction.reply('Work in progress');
	},
};