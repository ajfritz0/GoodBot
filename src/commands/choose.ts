import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import { BotCommand } from "../Interfaces";

import { SlashCommandBuilder } from 'discord.js';

const choose: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Choose from a list of comma seperated items')
		.addStringOption((option: SlashCommandStringOption) => option.setName('items')
			.setDescription('Item List')
			.setRequired(true)),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const str = interaction.options.getString('items', true);
		const items = str.split(',').map((x: string) => x.trim());
		return items[Math.floor(Math.random() * items.length)];
	},
};
module.exports = choose;