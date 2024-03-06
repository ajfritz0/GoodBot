// eslint-disable-next-line no-unused-vars
const { Events, ChatInputCommandInteraction, PermissionsBitField } = require('discord.js');

module.exports = {
	type: Events.InteractionCreate,
	once: false,
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns null
	 */
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;

		if (interaction.inGuild()) {
			const guildConfig = interaction.client.guildConfigs.get(interaction.guild.id);

			if (interaction.guild.ownerId !== interaction.user.id) {
				if (guildConfig.disabledCommands[interaction.commandName]) return interaction.reply({ content: 'This command is disabled', ephemeral: true });
				if (guildConfig.disabledChannels[interaction.channel.id]) return interaction.reply({ content: 'Commands are disabled for this channel', ephemeral: true });
				if (guildConfig.disabledUsers[interaction.user.id]) return interaction.reply({ content: 'You have been restricted from using these commands', ephemeral: true });
				if (!interaction.member.roles.cache.every((value, key) => (guildConfig.disabledRoles == undefined) ? true : !guildConfig.disabledRoles[key])) return interaction.reply({ content: 'This command is not available to your role', ephemeral: true });
				if (guildConfig.restrictedCommands[interaction.commandName] && !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({ content: 'You require elevated permissions to use this command', ephemeral: true });
			}
		}

		await interaction.deferReply();
		const start = (new Date()).getTime();

		let consoleStr = `==========\n\tCommand Name: ${interaction.commandName} / User: ${interaction.user.username}\n`;
		consoleStr += `\tChannel Name: ${(interaction.channel) ? interaction.channel.name : '---'} / Guild Name: ${(interaction.guild) ? interaction.guild.name : '---'}\n`;
		consoleStr += `\tCreated At: ${interaction.createdAt.toString()}`;
		console.log(consoleStr);
		command(interaction)
			.catch(error => {
				console.error(error);
				interaction.editReply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			})
			.then(msg => {
				if (msg) interaction.editReply(msg);
				const delta = (new Date()).getTime() - start;
				console.log(`Execution finished in ${delta} ms`);
			});
	},
};