const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('murder')
		.setDescription('murders'),
	async execute(interaction) {
		await interaction.reply('🗡️🔪'.repeat(200));
	},
};