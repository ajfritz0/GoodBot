const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause playing audio'),
	async execute(interaction) {
		interaction.client.mp.togglePause();
		interaction.reply('Paused playback');
		setTimeout(() => interaction.deleteReply(), 10 * 1000);
	},
};