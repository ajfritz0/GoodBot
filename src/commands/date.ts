import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('date')
		.setDescription('Returns the date and time with an optional timezone')
		.addStringOption((option: SlashCommandStringOption) =>
			option.setName('timezone')
				.setDescription('Reference timezone')),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const today = new Date();
		const tz = interaction.options.getString('timezone') || 'MST';

		try {
			const date = today.toLocaleString('en-US', { timeZone: tz });
			return date;
		}
		catch (e) {
			return `${tz} is not a valid timezone`;
		}
	},
};