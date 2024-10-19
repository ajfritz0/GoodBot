import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
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
		.setDefaultMemberPermissions(PermissionsBitField.Flags.UseApplicationCommands)
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