import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const getRandomIndex = (struct) => {
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
	const lookup = {
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

const getPostURL = (board, no) => {
	return `https://boards.4chan.org/${board}/thread/${no}`;
};

const getRandomThread = async (board: string) => {
	return new Promise((resolve, reject) => {
		if (!board || typeof board !== 'string') {
			reject(new Error('Invalid board'));
		}

		axios.get(`https://a.4cdn.org/${board}/catalog.json`)
			.then((response) => {
				const { data } = response;
				const page = getRandomIndex(data);
				const thread = getRandomIndex(
					page?.threads?.filter((thr) => thr.com && !thr.sticky),
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
module.exports = {
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
		const board = interaction.options.getString('board');
		const { link, text } = await getRandomThread(board);
		return `${text}\n - ${link}`;
	},
};