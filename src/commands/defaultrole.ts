import type { ChatInputCommandInteraction, SlashCommandRoleOption } from "discord.js";
import { BotCommand } from "../Interfaces";

// eslint-disable-next-line no-unused-vars
import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';

const defaultrole: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('defaultrole')
		.setDescription('Select a role to be used for members joining the guild')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
		.setDMPermission(false)
		.addRoleOption((option: SlashCommandRoleOption) => {
			return option.setName('role')
				.setDescription('Role Selector')
				.setRequired(true)
		}),
	helpMessage: '',
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns null
	 */
	async execute(interaction: ChatInputCommandInteraction) {
		return 'currently unavailable';
	},
};
module.exports = defaultrole;