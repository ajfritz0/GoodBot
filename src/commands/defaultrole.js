// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

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
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns null
	 */
	async execute(interaction) {
		const role = interaction.options.getRole('role');
		const guildConfig = interaction.client.guildConfigs.get(interaction.guild.id);
		if (role.managed == true || role.name == '@everyone') {
			return {
				ephemeral: true,
				content: `${role.name} is not an assignable role`,
			};
		}
		guildConfig.defaultRole = role.id;
		guildConfig.save();
		return {
			ephemeral: true,
			content: `New Users will be assigned role: ${role.name}`,
		};
	},
};