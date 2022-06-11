const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const start_music = (interaction, index = null) => {
	const videoDetails = interaction.client.mp.playTrack(index);
	console.log(videoDetails);
	const seconds = parseInt(videoDetails.duration);
	const time = Math.floor(seconds / 60).toString() + (seconds % 60).toString();

	const embed = new MessageEmbed()
		.setAuthor({
			name: videoDetails.author_name,
			url: videoDetails.author_url,
		})
		.setTitle(videoDetails.title)
		.setURL(videoDetails.video_url)
		.setThumbnail(videoDetails.thumbnail)
		.setTimestamp()
		.addField('Duration', ' ' + time, true);
	interaction.channel.send({
		embeds: [embed],
	});
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play youtube audio')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('Link to youtube video'))
		.addIntegerOption(option =>
			option.setName('track_num')
				.setDescription('Track number to play')),
	async execute(interaction) {
		const voice = interaction.guild.voiceStates.cache;
		const author = interaction.member;
		const voiceState = voice.get(author.id);
		const url = interaction.options.getString('url');
		const mp = interaction.client.mp;

		if (voiceState === undefined || voiceState.channelId === null) {
			await interaction.reply('You must be in a voice channel to use this command');
			return;
		}
		const channelId = voiceState.channelId;
		mp.joinVC(channelId, interaction.guild.id, interaction.guild.voiceAdapterCreator);

		await interaction.deferReply();
		if (url !== null && url !== undefined) {
			// if the playlist is empty, queue and play
			if (mp.isEmpty() || mp.isStopped) {
				const index = await mp.add(url);
				if (index == -1) {
					return interaction.editReply({
						content: 'Not a valid youtube URL',
						ephemeral: true,
					});
				}
				else {
					console.log(`INDEX: ${index}`);
					console.log(mp.playlist.playlist);
					start_music(interaction, index);
				}
			}
			else if (!mp.isStopped) {
				const test = await mp.add(url);
				if (test == -1) {
					return interaction.editReply({
						content: 'Not a valid youtube LINK',
						ephemeral: true,
					});
				}
				else {
					return interaction.editReply({
						content: `${test} track(s) added`,
						ephemeral: true,
					});
				}
			}
		}
		else {
			start_music(interaction);
		}
		return interaction.editReply({
			content: 'Playing music',
			ephemeral: true,
		});
	},
};