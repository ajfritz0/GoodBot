const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('Returns a link to a Wikipedia article')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Search term')
				.setRequired(true)),
	helpMessage: '',
	async execute(interaction) {
		const q = interaction.options.getString('query');
		const linkPromise = axios(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${q}&limit=1`);
		const summaryPromise = axios(`https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts&titles=${q}&exintro&explaintext&exsentences=3`);
		// const imagePromise = axios(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&titles=${q}`);

		const [linkData, summaryData] = await Promise.all([linkPromise, summaryPromise]);

		const info = {
			title: linkData[1][0],
			url: linkData[3][0],
			summary: (() => {
				const pages = summaryData['query']['pages'];
				const keys = Object.keys(pages);
				return pages[keys[0]]['extract'];
			})(),
		};
		const myembed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle(info.title)
			.setURL(info.url)
			.setDescription(info.summary);

		return { embeds: [myembed] };
	},
};