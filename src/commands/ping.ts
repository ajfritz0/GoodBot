import type { ChatInputCommandInteraction } from "discord.js";

import { SlashCommandBuilder } from 'discord.js';
import { BotCommand } from "../Interfaces";

const ping: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pings'),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		return `${(new Date()).getTime() - interaction.createdAt.getTime()}ms`;
	}
};
module.exports = ping;