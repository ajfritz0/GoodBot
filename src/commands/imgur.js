const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { clientId } = require('../../cfg/imgur.json');

axios.defaults.baseURL = 'https://api.imgur.com';
axios.defaults.headers.common['Authorization'] = `Client-ID ${clientId}`;

function randRange(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('imgur')
		.setDescription('Post an image from Imgur')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Image query')
				.setRequired(true),
		),
	helpMessage: '',
	async execute(interaction) {
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
