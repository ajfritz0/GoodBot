const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { clientId } = require('../cfg/imgur.json');

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
				.setDescription('Image search query.')
				.setRequired(true),
		),
	async execute(interaction) {
		interaction.deferReply();
		const q = interaction.options.getString('query');

		const data = await axios.get('/3/gallery/search', {
			params: {
				q,
			},
		});

		const len = data['data']['data'].length;
		const link = data['data']['data'][randRange(0, len)]?.link;
		await interaction.editReply((link === null) ? 'Nothing found' : link);
	},
};
