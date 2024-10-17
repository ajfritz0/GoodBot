import { ChatInputCommandInteraction, ColorResolvable, SlashCommandStringOption } from "discord.js";
import type { BotCommand } from "../Interfaces";

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';

const randomColor = (): ColorResolvable => {
	const hex = '0123456789abcdef';
	const r = () => hex[Math.floor(Math.random() * 16)];
	return `#${[0,0,0,0,0,0].map(r).join('')}`;
};

const wiki: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('Returns a link to a Wikipedia article')
		.addStringOption((option: SlashCommandStringOption) =>
			option.setName('query')
				.setDescription('Search term')
				.setRequired(true)),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const q = interaction.options.getString('query');
		const linkPromise = axios(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${q}&limit=1`);
		const summaryPromise = axios(`https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts&titles=${q}&exintro&explaintext&exsentences=3`);
		// const imagePromise = axios(`https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&titles=${q}`);

		const [linkData, summaryData] = await Promise.all([linkPromise, summaryPromise]);

		const info = {
			title: linkData['data'][1][0],
			url: linkData['data'][3][0],
			summary: (() => {
				const pages = summaryData['data']['query']['pages'];
				for (const page in pages) return pages[page]['extract'];
			})(),
		};
		const myembed = new EmbedBuilder()
			.setColor(randomColor())
			.setTitle(info.title)
			.setURL(info.url)
			.setDescription(info.summary);

		interaction.editReply({embeds: [myembed]});
	},
};
module.exports = wiki;