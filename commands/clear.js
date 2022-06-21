const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears the playlist queue'),
	async execute(interaction) {
		interaction.client.mp.clearPlaylist();
		return interaction.reply('Playlist cleared');
	},
};