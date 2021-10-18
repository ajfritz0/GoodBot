const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('Plays next audio track in queue'),
	async execute(interaction) {
		if (interaction.client.mp.playNextTrack() == -1) await interaction.reply({ content: 'No track in queue', ephemeral: true });
		else await interaction.reply({ content: 'Playing next track', ephemeral: true });
	},
};