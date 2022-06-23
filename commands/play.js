const { SlashCommandBuilder } = require('@discordjs/builders');
const MusicPlayer = require('../src/MusicPlayer');

module.exports = {
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
		const mpCollection = interaction.client.MusicPlayerCollection;
		const guildId = interaction.guild.id;

		if (!mpCollection.has(guildId)) mpCollection.set(guildId, new MusicPlayer());
		const mp = mpCollection.get(guildId);

		// check if the user is in a voice channel
		if (voiceState === undefined || voiceState.channelId === null) {
			await interaction.reply('You must be in a voice channel to use this command');
			return;
		}
		const channelId = voiceState.channelId;
		mp.joinVC(channelId, guildId, interaction.guild.voiceAdapterCreator);

		await interaction.deferReply();
		mp.textChannel = interaction.channel;
		if (url !== null && url !== undefined) {
			// if the playlist is empty or the music is stopped, queue and play
			if (mp.isEmpty() || mp.isStopped) {
				const index = await mp.add(url);
				if (index == -1) {
					return interaction.editReply({
						ephemeral: true,
						content: 'Not a valid youtube URL',
					});
				}
				else {
					const doesExist = mp.playTrack(index);
					if (!doesExist) {
						return interaction.editReply({
							ephemeral: true,
							content: 'Video does not exist',
						});
					}
				}
			}
			// if music is currently playing, just add to the queue
			else if (!mp.isStopped) {
				const index = await mp.add(url);
				if (index == -1) {
					return interaction.editReply({
						ephemeral: true,
						content: 'Not a valid youtube LINK',
					});
				}
				else {
					return interaction.editReply({
						ephemeral: true,
						content: 'Track(s) added',
					});
				}
			}
		}
		// if no url was provided, simply play whatever track in the queue is selected
		else {
			if (mp.isPaused()) {
				mp.togglePause();
				return interaction.editReply({
					content: 'Unpaused',
				}).then(msg => {
					setTimeout(() => msg.delete(), 5 * 1000);
				});
			}
			const doesExist = mp.playTrack();
			if (doesExist == null) {
				return interaction.editReply({
					ephemeral: true,
					content: 'Video does not exist',
				});
			}
		}
		return interaction.editReply({
			ephemeral: true,
			content: 'Playing music',
		});
	},
};