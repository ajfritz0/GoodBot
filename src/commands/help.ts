import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

import { SlashCommandBuilder } from 'discord.js';
import { BotCommand } from "../Interfaces";

interface MessageStruct {
	[index: string]: {
		desc: string,
		info: string,
	},
}

const help: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Receive help on this bots functionality')
		.addStringOption((option: SlashCommandStringOption) => {
			return option.setName('cmd')
				.setDescription('Command Name');
		}),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		return 'currently unavailable';
	},
};
module.exports = help;