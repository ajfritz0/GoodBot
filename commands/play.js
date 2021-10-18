const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const MusicPlayer = require('../lib/MusicPlayer');

module.exports = function(client) {
	if (client !== null) {
		client.on('voiceStateUpdate', () => {
			console.log('----------------------------------------------');
		});

		/*
		client._audio = {
			player: createAudioPlayer(),
			connection: null,
			connectionTimer: null,
			ytdlStream: null,
			audioResource: null,
			isStreaming: false,
		};
		*/

		client.mp = new MusicPlayer();
	}
	return {
		data: new SlashCommandBuilder()
			.setName('play')
			.setDescription('Play youtube audio')
			.addStringOption(option =>
				option.setName('url')
					.setDescription('Link to youtube video')),
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

			try {
				console.log('Entering try block');
				mp.play(url);

				console.log('Building embed');
				const title = await mp.getTitle(url);
				const embed = new MessageEmbed({
					title: 'Now Playing:',
					description: title,
					url,
				});
				console.log('Editing reply');

				await interaction.reply({ content: 'Playing', embeds: [embed] });
				mp._interaction = interaction;
				console.log('End try block');
			}
			catch (e) {
				console.log('Enter catch block');
				return await interaction.reply({
					content: e,
					ephemeral: true,
				});
			}
		},
	};
};