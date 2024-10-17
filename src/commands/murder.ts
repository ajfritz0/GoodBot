import { BotCommand } from "../Interfaces";

import { SlashCommandBuilder } from 'discord.js';

const murder: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('murder')
		.setDescription('Murders'),
	helpMessage: 'murder',
	async execute() {
		return '🗡️🔪'.repeat(200);
	},
};
module.exports = murder;