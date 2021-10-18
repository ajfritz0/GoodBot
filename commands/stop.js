const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops currently playing audio'),
	async execute(interaction) {
		interaction.client.mp.stop();
		await interaction.reply('Stopped');
		setTimeout(() => interaction.deleteReply(), 10 * 1000);
	},
};