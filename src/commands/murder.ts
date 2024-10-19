import { BotCommand } from "../Interfaces";

import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';

const murder: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('murder')
		.setDescription('Murders')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.UseApplicationCommands),
	helpMessage: 'murder',
	async execute() {
		return '🗡️🔪'.repeat(200);
	},
};
module.exports = murder;