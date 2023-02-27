const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('date')
		.setDescription('Returns the date and time with an optional timezone')
		.addStringOption(option =>
			option.setName('timezone')
				.setDescription('Reference timezone')),
	helpMessage: '',
	async execute(interaction) {
		const today = new Date();
		const tz = interaction.options.getString('timezone') || 'MST';

		try {
			const date = today.toLocaleString('en-US', { timeZone: tz });
			return await interaction.reply(date);
		}
		catch (e) {
			return await interaction.reply(`${tz} is not a valid timezone`);
		}
	},
};