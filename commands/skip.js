const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const start_music = (interaction, videoDetails) => {
	const seconds = parseInt(videoDetails.duration);
	const timeString = Math.floor(seconds / 60).toString() + (seconds % 60).toString();

	const embed = new MessageEmbed()
		.setTitle(videoDetails.title)
		.setAuthor({
			name: videoDetails.author_name,
			url: videoDetails.author_url,
		})
		.setURL(videoDetails.video_url)
		.setThumbnail(videoDetails.thumbnail)
		.setTimestamp()
		.addField('Duration', timeString, true);
	interaction.channel.send({
		embeds: [embed],
	});
};

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
		start_music(interaction, video);
		return interaction.reply({
			content: 'Playing music',
			ephemeral: true,
		});
	},
};