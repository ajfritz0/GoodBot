const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Queue a track to play')
		.addStringOption(option => {
			return option.setName('track')
				.setDescription('URL to add to queue');
		}),
	async execute(interaction) {
		const track = interaction.options.getString('track');

		if (track == null || track == undefined) return await interaction.reply({ content: interaction.client.mp.getNextTrack(), ephemeral: true });

		try {
			interaction.client.mp.addTrack(track);
			const title = await interaction.client.mp.getTitle(track);
			await interaction.reply(`**Added track**:${title}`);
		}
		catch (e) {
			await interaction.reply({ content: e, ephemeral: true });
		}
	},
};