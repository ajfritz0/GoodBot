const { SlashCommandBuilder } = require('discord.js');

function randInt(a, b) {
	const min = Math.min(a, b);
	const max = Math.max(a, b);
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Return a random number between 2 values')
		.addIntegerOption((option) => option.setName('min_value').setDescription('Minimum Value (Default: 1)'))
		.addIntegerOption((option) => option.setName('max_value').setDescription('Maximum Value (Default: 100)')),
	helpMessage: '',
	async execute(interaction) {
		const x = interaction.options.getInteger('min_value') || 1,
			y = interaction.options.getInteger('max_value') || 100;
		await interaction.reply(randInt(x, y).toString());
	},
};