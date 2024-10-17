import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { BotCommand } from "../Interfaces";

const getRandomIndex = (struct: any[]): any => {
	if (!struct) {
		return null;
	}
	return struct[Math.floor(Math.random() * struct.length)];
};
// Lol yeah this works for this case alright
const sanitizeHTML = (str: string) => {
	return str.replace(/(<([^>]+)>)/gi, '');
};

const decodeEntities = (str: string) => {
	const lookup: { [key: string]: any } = {
		'lt': '<',
		'gt': '>',
		'nbsp': ' ',
		'amp': '&',
		'quot': '"',
	};

	return str
		.replace(/&(gt|lt|nbsp|amp|quot);/g, (_m, e) => lookup[e])
		.replace(/&#(\d+);/gi, (_m, num) => String.fromCharCode(parseInt(num)));
};

const getPostURL = (board: string, no: number) => {
	return `https://boards.4chan.org/${board}/thread/${no}`;
};

const getRandomThread = async (board: string): Promise<{ link: string; text: string; }> => {
	return new Promise((resolve, reject) => {
		if (!board || typeof board !== 'string') {
			reject(new Error('Invalid board'));
		}

		axios.get(`https://a.4cdn.org/${board}/catalog.json`)
			.then((response) => {
				const { data } = response;
				const page = getRandomIndex(data);
				const thread = getRandomIndex(
					page?.threads?.filter((thr: any) => thr.com && !thr.sticky && (!thr.sub || !thr.sub?.toLowerCase()?.includes('general'))),
				);
				if (!thread) {
					reject(new Error('Could not parse thread info.'));
				}
				else {
					resolve({
						link: getPostURL(board, thread.no),
						text: sanitizeHTML(decodeEntities(thread.com)),
					});
				}
			})
			.catch((error) => {
				reject(new Error(`Could not complete request: ${error}`));
			});
	});
};
const fourchan: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('4chan')
		.setDescription('Pull a random link to a  post on a specified 4chan board')
		.addStringOption((option: SlashCommandStringOption) =>
			option.setName('board')
				.setDescription('The board to pull from')
				.setRequired(true),
		),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const board = interaction.options.getString('board', true);
		const { link, text } = await getRandomThread(board);
		return `${text}\n - ${link}`;
	},
};
module.exports = fourchan;