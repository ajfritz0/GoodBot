const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');

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
        response += `${getPostUrl(id)}\n`
    });
    return response;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hackernews')
		.setDescription('Top Hackers News Posts')
		.addStringOption(option =>
			option.setName('numposts')
				.setDescription('The number of posts to return'),
		),
	async execute(interaction) {
		await interaction.deferReply();
		const numPosts = interaction.options.getString('numposts') || 3;
		const response = await getTopPosts(numPosts);
		return await interaction.editReply(response);
	},
}
