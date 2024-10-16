import type { ChatInputCommandInteraction } from "discord.js";

import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pings'),
	async execute(interaction: ChatInputCommandInteraction) {
		return `${(new Date()).getTime() - interaction.createdAt.getTime()}ms`;
	}
};