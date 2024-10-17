import type { ChatInputCommandInteraction, SlashCommandIntegerOption, SlashCommandStringOption } from "discord.js";
import { BotCommand } from "../Interfaces";

import axios from 'axios';
import { SlashCommandBuilder } from 'discord.js';

const getPostUrl = (id: string) => {
	return `https://news.ycombinator.com/item?id=${id}`;
};

const getTopPosts = async (numPosts: number) => {
	let response = '';
	let limit = (numPosts < 1 || numPosts > 5) ? 3 : numPosts;

	const { data } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
	if (!data) {
		throw new Error('Could not complete request to HN API');
	}

	if (limit > data.length) {
		limit = data.length;
	}

	const topIds = data.slice(0, limit);
	topIds.forEach((id: string) => {
		response += `${getPostUrl(id)}\n`;
	});
	return response;
};

const hackernews: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('hackernews')
		.setDescription('Retrieve the top posts from HackerNews')
		.addIntegerOption((option: SlashCommandIntegerOption) =>
			option.setName('numposts')
				.setDescription('The number of posts to return'),
		),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const numPosts = interaction.options.getInteger('numposts') || 3;
		const response = await getTopPosts(numPosts);
		return response;
	},
};
module.exports = hackernews;