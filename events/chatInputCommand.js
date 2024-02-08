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

		const guildConfig = interaction.client.guildConfigs.get(interaction.guild.id);
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;

		if (Object.hasOwn(guildConfig.restrictedChannels, interaction.channel.id)) return interaction.reply({ content: 'Commands are disabled for this channel', ephemeral: true });
		if (Object.hasOwn(guildConfig.restrictedUsers, interaction.user.id)) return interaction.reply({ content: 'You have been restricted from using these commands', ephemeral: true });
		if (Object.hasOwn(guildConfig.disabledCommands, interaction.commandName)) return interaction.reply({ content: 'This command is disabled', ephemeral: true });
		if (Object.hasOwn(guildConfig.restrictedCommands, interaction.commandName) && !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({ content: 'You require elevated permissions to use this command', ephemeral: true });

		interaction.deferReply();
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
				interaction.editReply(msg);
				const delta = (new Date()).getTime() - start;
				console.log(`Execution finished in ${delta} ms`);
			});
	},
};