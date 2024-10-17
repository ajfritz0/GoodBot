import type { ChatInputCommandInteraction, SlashCommandIntegerOption } from "discord.js";
import { BotCommand } from "../Interfaces";

import { SlashCommandBuilder } from 'discord.js';

function randInt(a: number, b: number) {
	const min = Math.min(a, b);
	const max = Math.max(a, b);
	return Math.floor(Math.random() * (max - min)) + min;
}

const random: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Return a random number between 2 values')
		.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('min_value').setDescription('Minimum Value (Default: 1)'))
		.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('max_value').setDescription('Maximum Value (Default: 100)')),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const x = interaction.options.getInteger('min_value') || 1,
			y = interaction.options.getInteger('max_value') || 100;
		return randInt(x, y).toString();
	},
};
module.exports = random;