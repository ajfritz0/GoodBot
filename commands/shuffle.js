const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffles the playlist queue'),
	async execute(interaction) {
		interaction.client.mp.shuffle();
		return interaction.reply('Music Shuffled').then((reply => {
			setTimeout(() => reply.delete(), 10 * 1000);
		}));
	},
};