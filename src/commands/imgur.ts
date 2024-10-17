import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import path from 'node:path';
import { BotCommand } from "../Interfaces";
const { clientId } = require(path.resolve(__dirname, '../../cfg/config.json'));

axios.defaults.baseURL = 'https://api.imgur.com';
axios.defaults.headers.common['Authorization'] = `Client-ID ${clientId}`;

function randRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min;
}
const imgur: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('imgur')
		.setDescription('Post an image from Imgur')
		.addStringOption((option: SlashCommandStringOption) =>
			option.setName('query')
				.setDescription('Image query')
				.setRequired(true),
		),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const q = interaction.options.getString('query');

		const data = await axios.get('/3/gallery/search', {
			params: {
				q,
			},
		});

		const len = data['data']['data'].length;
		const link = data['data']['data'][randRange(0, len)]?.link;
		return (link === null || link === undefined || link.length == 0) ? 'Nothing found' : link;
	},
};
module.exports = imgur;
