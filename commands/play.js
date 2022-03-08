const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

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

		try {
			await mp.play(url);

			const title = await mp.getTitle(url);
			const embed = new MessageEmbed({
				title: 'Now Playing:',
				description: title,
				url,
			});

			await interaction.reply({ content: 'Playing', embeds: [embed] });
			mp._interaction = interaction;
		}
		catch (e) {
			console.error(e);
			return await interaction.reply({
				content: e,
				ephemeral: true,
			});
		}
	},
};