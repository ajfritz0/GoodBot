import type { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } from 'discord.js';
import path from 'node:path';
import { BotCommand } from "../Interfaces";
const rorMetadata = require(path.resolve(process.cwd(),'./databases/RoR2ItemDescriptions.json'));

const roi: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('roi')
		.setDescription('Returns information about items in Risk of Rain 2')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.UseApplicationCommands)
		.addStringOption((option: SlashCommandStringOption) => option.setName('item').setDescription('Item name').setAutocomplete(true).setRequired(true)),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const itemName = interaction.options.getString('item', true);
		const itemData = rorMetadata[itemName];

		if (!itemData) return 'Item does not exist';

		const itemEmbed = new EmbedBuilder()
			.setColor(itemData['color'])
			.setTitle(itemName)
			.setDescription(itemData['desc']);
		interaction.editReply({embeds: [itemEmbed]});
	},
	async autocomplete(interaction: AutocompleteInteraction) {
		const keys = Object.keys(rorMetadata);
		const focusedOption = interaction.options.getFocused(true);

		const filtered = keys.filter(key => key.toLowerCase().indexOf(focusedOption.value.toLowerCase()) > -1).slice(0, 10);

		interaction.respond(
			filtered.map(key => ({ name: key, value: key })),
		);
	},
};
module.exports = roi;