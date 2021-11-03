const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('date')
		.setDescription('Returns the date and time')
		.addStringOption(option =>
			option.setName('timezone')
				.setDescription('Reference timezone')),
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