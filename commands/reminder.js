const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rem')
		.setDescription('Sends a messages at a specific time.'),
	async execute(interaction) {
		await interaction.reply('Nothing here yet');
	},
};