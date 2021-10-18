const { SlashCommandBuilder } = require('@discordjs/builders');

function randInt(a, b) {
	const min = Math.min(a, b);
	const max = Math.max(a, b);
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Return a random number between 1 and 100')
		.addIntegerOption((option) => option.setName('min_value').setDescription('The minimum value of the number'))
		.addIntegerOption((option) => option.setName('max_value').setDescription('The maximum value of the number')),
	async execute(interaction) {
		const x = interaction.options.getInteger('min_value') || 0,
			y = interaction.options.getInteger('max_value') || 10;
		await interaction.reply(randInt(x, y).toString());
	},
};