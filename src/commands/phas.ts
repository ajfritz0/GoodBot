import type { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const phasMetadata = require('../../databases/PhasGhostDescriptions.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('phas')
		.setDescription('Returns information about ghosts in Phasmophobia')
		.addStringOption((option: SlashCommandStringOption) => option.setName('ghost').setDescription('Ghost Name').setAutocomplete(true).setRequired(true)),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const ghostName = interaction.options.getString('ghost', true);
		const ghostData = phasMetadata[ghostName];

		if (!ghostData) return 'Ghost does not exist';

		const infoEmbed = new EmbedBuilder()
			.setColor(ghostData['color'])
			.setTitle(ghostName)
			.setDescription(ghostData['desc'])
			.addFields(
				{ name: ghostData['fields'][0]['title'], value: ghostData['fields'][0]['desc'], inline: true },
				{ name: ghostData['fields'][1]['title'], value: ghostData['fields'][1]['desc'], inline: true },
			)
			.setFooter({ text: ghostData['footer'] == '' ? null : ghostData['footer'] });
		return { embeds: [infoEmbed] };
	},
	async autoComplete(interaction: AutocompleteInteraction) {
		const keys = Object.keys(phasMetadata);
		const focusedOption = interaction.options.getFocused(true);

		const filtered = keys.filter(key => key.toLowerCase().indexOf(focusedOption.value.toLowerCase()) > -1).slice(0, 10);

		interaction.respond(
			filtered.map(key => ({ name: key, value: key })),
		);
	},
};