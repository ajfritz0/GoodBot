import { BotCommand } from "../Interfaces";

import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';

const flip: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flip a coin')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.UseApplicationCommands),
	helpMessage: '',
	async execute() {
		const coin = Math.floor(Math.random() * 2);
		return ((coin) ? 'Heads' : 'Tails');
	},
};
module.exports = flip;