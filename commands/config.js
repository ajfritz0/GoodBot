// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Configure command permissions and scopes')
		.addSubcommand(subcommand =>
			subcommand
				.setName('enable')
				.setDescription('Enable a command globally')
				.addStringOption(option =>
					option
						.setName('command')
						.setDescription('The command name')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('disable')
				.setDescription('Disable a command globally')
				.addStringOption(option =>
					option
						.setName('command')
						.setDescription('The command name')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('auth-command')
				.setDescription('Allow anyone with command permissions to use a command')
				.addStringOption(option =>
					option
						.setName('command')
						.setDescription('The command name')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('deauth-command')
				.setDescription('Restrict use of a command to members with \'Manage Role\' permission')
				.addStringOption(option =>
					option
						.setName('command')
						.setDescription('The command name')
						.setRequired(true)),
		).addSubcommand(subcommand =>
			subcommand
				.setName('auth-user')
				.setDescription('Authorize a user to use any non-restricted command')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The member to authorize')
						.setRequired(true),
				),
		).addSubcommand(subCommand =>
			subCommand
				.setName('deauth-user')
				.setDescription('Restrict a user from using all commands')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The member to restrict')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('auth-channel')
				.setDescription('Authorize use of all commands in a channel')
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('The channel to authorize')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('deauth-channel')
				.setDescription('Disable use of all command in a channel')
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('The channel to restrict')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('auth-role')
				.setDescription('Authorize a role to use commands')
				.addRoleOption(option =>
					option
						.setName('role')
						.setDescription('The role to authorize')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('deauth-role')
				.setDescription('Disable use of commands for a role')
				.addRoleOption(option =>
					option
						.setName('role')
						.setDescription('The role to restrict')
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
			const name = interaction.options.getString('command');
			if (!interaction.client.commands.has(name)) return { content: 'That command does not exist.', ephemeral: true };

			guildConfig.enableCommand(name);
			return { content: `Command **${name}** Enabled`, ephemeral: true };
		}
		else if (subcommand == 'disable') {
			const name = interaction.options.getString('command');
			if (!interaction.client.commands.has(name)) return { content: 'That command does not exist.', ephemeral: true };

			guildConfig.disableCommand(name);
			return { content: `Command **${name}** Disabled`, ephemeral: true };
		}
		else if (subcommand == 'auth-command') {
			const name = interaction.options.getString('command');
			if (!interaction.client.commands.has(name)) return { content: 'That command does not exist.', ephemeral: true };

			guildConfig.auth({ 'command': name });
			return { content: `Command **${name}** has been made unrestricted for all users`, ephemeral: true };
		}
		else if (subcommand == 'deauth-command') {
			const name = interaction.options.getString('command');
			if (!interaction.client.commands.has(name)) return { content: 'That command does not exist.', ephemeral: true };

			guildConfig.deauth({ 'command': name });
			return { content: `Command **${name}** is now restricted to users with the 'Manage Role' permisssion.`, ephemeral: true };
		}
		else if (subcommand == 'auth-user') {
			const user = interaction.options.getUser('user');

			guildConfig.auth({ 'user': user.id });
			return { content: `${user.username} is now allowed use of commands.`, ephemeral: true };
		}
		else if (subcommand == 'deauth-user') {
			const user = interaction.options.getUser('user');

			guildConfig.deauth({ 'user': user.id });
			return { content: `${user.username} is now restricted from using any commands.`, ephemeral: true };
		}
		else if (subcommand == 'auth-channel') {
			const channel = interaction.options.getChannel('channel');

			guildConfig.auth({ 'channel': channel.id });
			return { content: `Commands are now permitted for in channel **${channel.name}**`, ephemeral: true };
		}
		else if (subcommand == 'deauth-channel') {
			const channel = interaction.options.getChannel('channel');

			guildConfig.deauth({ 'channel': channel.id });
			return { content: `Commands are now prohibited in channel **${channel.name}**`, ephemeral: true };
		}
		else if (subcommand == 'auth-role') {
			const role = interaction.options.getRole('role');

			guildConfig.auth({ 'role': role.id });
			return { content: `Commands have been authorized for role **${role.name}**`, ephemeral: true };
		}
		else if (subcommand == 'deauth-role') {
			const role = interaction.options.getRole('role');

			guildConfig.deauth({ 'role': role.id });
			return { content: `Commands have been restricted for role **${role.name}**`, ephemeral: true };
		}
		else {
			throw new Error(`Unexpected subcommand ${subcommand}`);
		}
	},
};