// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('defaultrole')
		.setDescription('Select a role to be used for members joining the guild')
		.addRoleOption(option => {
			return option.setName('role')
				.setDescription('Role Selector')
				.setRequired(true);
		}),
	helpMessage: '',
	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @returns null
	 */
	async execute(interaction) {
		/*
		const roleSelectMenu = new RoleSelectMenuBuilder()
			.setCustomId('defaultRoleSelect')
			.setPlaceholder('...');
		const actionRow = new ActionRowBuilder()
			.addComponents(roleSelectMenu);

		return interaction.reply({
			content: 'Chose a Role',
			components: [actionRow],
		});
		*/

		const role = interaction.options.getRole('role');
		if (role.managed == true || role.name == '@everyone') {
			return {
				ephemeral: true,
				content: `${role.name} is not an assignable role`,
			};
		}
		// store the role information somewhere
		return {
			ephemeral: true,
			content: `New Users will be assigned role: ${role.name}`,
		};
	},
};