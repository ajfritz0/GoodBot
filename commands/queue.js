const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Queue a track to play'),
	async execute(interaction) {
		return interaction.reply({
			content: interaction.client.mp.playlist.showUpcoming(),
			ephemeral: true,
		});
	},
};