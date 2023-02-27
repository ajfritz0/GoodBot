const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Choose from a list of comma seperated items')
		.addStringOption((option) => option.setName('items')
			.setDescription('Item List')),
	helpMessage: '',
	async execute(interaction) {
		const items = interaction.options.getString('items').split(',').map(x => x.trim());
		interaction.reply(items[Math.floor(Math.random() * items.length)]);
	},
};