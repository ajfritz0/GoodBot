const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

const getPostUrl = (id) => {
	return `https://news.ycombinator.com/item?id=${id}`;
};

const getTopPosts = async (numPosts) => {
	let response = '';
	let limit = parseInt(numPosts, 10) || 10;

	const { data } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
	if (!data) {
		throw new Error('Could not complete request to HN API');
	}

	if (limit > data.length) {
		limit = data.length;
	}

	const topIds = data.slice(0, limit);
	topIds.forEach((id) => {
		response += `${getPostUrl(id)}\n`;
	});
	return response;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hackernews')
		.setDescription('Retrieve the top posts from HackerNews')
		.addStringOption(option =>
			option.setName('numposts')
				.setDescription('The number of posts to return'),
		),
	helpMessage: '',
	async execute(interaction) {
		const numPosts = interaction.options.getString('numposts') || 3;
		const response = await getTopPosts(numPosts);
		return response;
	},
};
