import type { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } from 'discord.js';
import path from 'node:path';
import { BotCommand } from "../Interfaces";
const phasMetadata = require(path.resolve(process.cwd(),'./databases/PhasGhostDescriptions.json'));

const phas: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('phas')
		.setDescription('Returns information about ghosts in Phasmophobia')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.UseApplicationCommands)
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
		interaction.editReply({embeds: [infoEmbed]});
	},
	async autocomplete(interaction: AutocompleteInteraction) {
		const keys = Object.keys(phasMetadata);
		const focusedOption = interaction.options.getFocused(true);

		const filtered = keys.filter(key => key.toLowerCase().indexOf(focusedOption.value.toLowerCase()) > -1).slice(0, 10);

		interaction.respond(
			filtered.map(key => ({ name: key, value: key })),
		);
	},
};
module.exports = phas;