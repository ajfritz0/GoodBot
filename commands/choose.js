const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Choose from a list of items')
		.addStringOption((option) => option.setName('items')
			.setDescription('A list of comma separated items to choose from')),
	async execute(interaction) {
		const items = interaction.options.getString('items').split(',').map(x => x.trim());
		interaction.reply(items[Math.floor(Math.random() * items.length)]);
	},
};