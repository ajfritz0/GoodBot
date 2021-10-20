const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('markov')
		.setDescription('Markov Chain Text Generator'),
	async execute(interaction) {
		await interaction.reply('Nothing here for now');
	},
};