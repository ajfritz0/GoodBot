const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const rorMetadata = require('../../databases/RoR2ItemDescriptions.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roi')
		.setDescription('Returns information about items in Risk of Rain 2')
		.addStringOption(option => option.setName('item').setDescription('Item name').setAutocomplete(true)),
	helpMessage: '',
	async execute(interaction) {
		const itemName = interaction.options.getString('item');
		const itemData = rorMetadata[itemName];

		if (!itemData) return 'Item does not exist';

		const itemEmbed = new EmbedBuilder()
			.setColor(itemData['color'])
			.setTitle(itemName)
			.setDescription(itemData['desc']);
		return { embeds: [itemEmbed] };
	},
	async autoComplete(interaction) {
		const keys = Object.keys(rorMetadata);
		const focusedOption = interaction.options.getFocused(true);

		const filtered = keys.filter(key => key.toLowerCase().indexOf(focusedOption.value.toLowerCase()) > -1).slice(0, 10);

		interaction.respond(
			filtered.map(key => ({ name: key, value: key })),
		);
	},
};