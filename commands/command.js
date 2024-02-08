// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('command')
		.setDescription('Configure command permissions and scopes')
		.addSubcommand(subcommand =>
			subcommand
				.setName('enable')
				.setDescription('Enable a command globally')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The command name')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('disable')
				.setDescription('Disable a command globally')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The command name')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('restrict')
				.setDescription('Restrict use of a command to members with \'Manage Role\' permission')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The command name')
						.setRequired(true),
				).addBooleanOption(option =>
					option
						.setName('value')
						.setDescription('Set to true to restrict command, false otherwise')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Restrict a user from using commands')
				.addUserOption(option =>
					option
						.setName('name')
						.setDescription('The member to restrict')
						.setRequired(true),
				).addBooleanOption(option =>
					option
						.setName('value')
						.setDescription('Set true to disable all comamands to a user, false to enable')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('channel')
				.setDescription('Disable use of all commands in a channel')
				.addChannelOption(option =>
					option
						.setName('name')
						.setDescription('Select channel')
						.setRequired(true),
				).addBooleanOption(option =>
					option
						.setName('value')
						.setDescription('Set true to disable all commands for a given channel, false to enable')
						.setRequired(true),
				),
		),
	helpMessage: '',
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns
	 */
	async execute(interaction) {
		// 5 subcommands: enable, disable, restrict, user, and channel
		const subcommand = interaction.options.getSubcommand();
		const guildConfig = interaction.client.guildConfigs.get(interaction.guild.id);

		if (subcommand == 'enable') {
			const name = interaction.options.getString('name');
			if (name == 'command') return { content: `Command **${name}** cannot be disabled.`, ephemeral: true };
			if (!interaction.client.commands.has(name)) return { content: 'That command does not exist.', ephemeral: true };

			guildConfig.enableCommand(name);
			return { content: `Command **${name}** Enabled`, ephemeral: true };
		}
		else if (subcommand == 'disable') {
			const name = interaction.options.getString('name');
			if (name == 'command') return { content: `Command **${name}** cannot be disabled.`, ephemeral: true };
			if (!interaction.client.commands.has(name)) return { content: 'That command does not exist.', ephemeral: true };

			guildConfig.disableCommand(name);
			return { content: `Command **${name}** Disabled`, ephemeral: true };
		}
		else if (subcommand == 'restrict') {
			const name = interaction.options.getString('name');
			if (!interaction.client.commands.has(name)) return { content: 'That command does not exist.', ephemeral: true };

			const value = interaction.options.getBoolean('value');
			if (value) {
				guildConfig.restrictCommand(name);
				return { content: `Command **${name}** is now restricted to users with elevated permissions`, ephemeral: true };
			}
			else {
				guildConfig.unrestrictCommand(name);
				return { content: `Command **${name}** has been made unrestricted for all users`, ephemeral: true };
			}
		}
		else if (subcommand == 'user') {
			const user = interaction.options.getUser('name');
			const value = interaction.options.getBoolean('value');
			if (value) {
				guildConfig.restrictUser(user.id);
				return { content: `${user.username} has been restricted from using commands.`, ephemeral: true };
			}
			else {
				guildConfig.unrestrictUser(user.id);
				return { content: `${user.username} is now allowed use of commands.`, ephemeral: true };
			}
		}
		else if (subcommand == 'channel') {
			const channel = interaction.options.getChannel('name');
			const value = interaction.options.getBoolean('value');
			if (value) {
				guildConfig.restrictChannel(channel.id);
				return { content: `Commands are now restricted for #${channel.name}.`, ephemeral: true };
			}
			else {
				guildConfig.unrestrictChannel(channel.id);
				return { content: `Commands are now allowed in #${channel.name}`, ephemeral: true };
			}
		}
		else {
			throw new Error(`Unexpected subcommand ${subcommand}`);
		}
	},
};