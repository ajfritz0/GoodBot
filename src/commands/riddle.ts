import type { ChatInputCommandInteraction, MessageComponentInteraction } from "discord.js";

// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('riddle')
		.setDescription('Get a riddle'),
	helpMessage: '',
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns
	 */
	async execute(interaction: ChatInputCommandInteraction) {
		const spoilerBtn = new ButtonBuilder()
			.setCustomId('showspoiler')
			.setLabel('Answer')
			.setStyle(ButtonStyle.Primary);
		const row = new ActionRowBuilder()
			.addComponents(spoilerBtn);
		const riddle = await axios.get('https://riddles-api.vercel.app/random');
		if (riddle.status !== 200) return 'Riddle API is unavailable';

		const res = await interaction.editReply({
			content: riddle.data.riddle,
			components: [row],
		});

		const collectorFilter = (i: MessageComponentInteraction) => i.user.id == interaction.user.id;
		try {
			const confirmation = await res.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
			if (confirmation.customId == 'showspoiler') {
				await confirmation.update({ content: riddle.data.answer, components: [] });
			}
		}
		catch (e) {
			await interaction.editReply({ content: riddle.data.answer, components: [] });
		}

		return null;
	},
};