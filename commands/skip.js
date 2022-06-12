const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Plays next audio track in queue')
		.addIntegerOption(option => {
			return option.setName('num')
				.setDescription('Track Number');
		}),
	async execute(interaction) {
		const mp = interaction.client.mp;
		const trackNum = interaction.options.getInteger('num');

		let video = null;
		if (trackNum == null || trackNum == undefined) {
			video = mp.playNext();
			if (video == null) {
				return interaction.reply({
					content: 'No track selected',
					ephemeral: true,
				});
			}
		}
		else {
			video = mp.playTrack(trackNum);
			if (video == null) {
				return interaction.reply({
					content: 'That track does not exist',
					ephemeral: true,
				});
			}
		}
		if (video == null) console.log('Something is majorly wrong');
		const embed = mp.createEmbed(video);

		interaction.channel.send({
			embeds: [embed],
		}).then(msg => {
			setTimeout(() => msg.delete(), 60 * 1000);
		});
		return interaction.reply({
			content: 'Playing music',
			ephemeral: true,
		});
	},
};