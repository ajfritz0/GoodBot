const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Queue a track to play'),
	async execute(interaction) {
		const content = interaction.client.mp.showUpcoming();
		const embed = new MessageEmbed()
			.setTitle('Queued songs:')
			.setDescription(content);
		interaction.reply({
			embeds: [embed],
		});
	},
};