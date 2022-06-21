const { SlashCommandBuilder } = require('@discordjs/builders');

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
						ephemeral: true,
						content: 'Not a valid youtube URL',
					});
				}
				else {
					const video = mp.playTrack(index);
					if (video == null) {
						return interaction.editReply({
							ephemeral: true,
							content: 'Video does not exist',
						});
					}
					const embed = mp.createEmbed(video);
					interaction.channel.send({
						embeds: [embed],
					}).then((msg) => {
						setTimeout(() => msg.delete(), 60 * 1000);
					});
				}
			}
			else if (!mp.isStopped) {
				const test = await mp.add(url);
				if (test == -1) {
					return interaction.editReply({
						ephemeral: true,
						content: 'Not a valid youtube LINK',
					});
				}
				else {
					return interaction.editReply({
						ephemeral: true,
						content: 'Tracks added',
					});
				}
			}
		}
		else {
			const video = mp.playTrack();
			if (video == null) {
				return interaction.editReply({
					ephemeral: true,
					content: 'Video does not exist',
				});
			}
			const embed = mp.createEmbed(video);
			interaction.channel.send({
				embeds: [embed],
			}).then((msg) => {
				setTimeout(() => msg.delete(), 60 * 1000);
			});
		}
		return interaction.editReply({
			ephemeral: true,
			content: 'Playing music',
		});
	},
};