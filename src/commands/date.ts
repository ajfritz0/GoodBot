import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import { BotCommand } from "../Interfaces";

import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';

const date: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('date')
		.setDescription('Returns the date and time with an optional timezone')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.UseApplicationCommands)
		.addStringOption((option: SlashCommandStringOption) =>
			option.setName('timezone')
				.setDescription('Reference timezone')),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const today = new Date();
		const tz = interaction.options.getString('timezone') || 'MST';

		try {
			const dateObj = today.toLocaleString('en-US', { timeZone: tz });
			return dateObj;
		}
		catch (e) {
			return `${tz} is not a valid timezone`;
		}
	},
};
module.exports = date;