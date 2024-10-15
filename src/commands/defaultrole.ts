import type { ChatInputApplicationCommandData, ChatInputCommandInteraction, SlashCommandRoleOption } from "discord.js";

// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('defaultrole')
		.setDescription('Select a role to be used for members joining the guild')
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
		const role = interaction.options.getRole('role', true);
		const guildConfig = interaction.client.guildConfigs.get(interaction.guild.id);
		if (!role) return `The default role for new users is: ${guildConfig.defaultRole.name}`;
		if (role.managed == true || role.name == '@everyone') {
			return {
				ephemeral: true,
				content: `${role.name} is not an assignable role`,
			};
		}
		if (role.comparePositionTo(interaction.guild.members.cache.get(interaction.client.id).roles.highest) > 0) {
			return `I do not have permission to assign role ${role.name}. Please check your server roles.`;
		}
		guildConfig.defaultRole = {
			name: role.name,
			id: role.id,
		};
		guildConfig.save();
		return {
			ephemeral: true,
			content: `New Users will be assigned role: ${role.name}`,
		};
	},
};