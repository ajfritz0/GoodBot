const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('Search Wikipedia')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Search term')
				.setRequired(true)),
	async execute(interaction) {
		interaction.deferReply();
		const q = interaction.options.getString('query');
		const linkData = (await axios(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${q}&limit=1`))['data'];
		const summaryData = (await axios(`https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts&titles=${q}&exintro&explaintext&exsentences=3`))['data'];
		const imageData = (await axios(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&titles=${q}`))['data'];

		console.log(imageData);

		const info = {
			title: linkData[1][0],
			url: linkData[3][0],
			summary: (() => {
				const pages = summaryData['query']['pages'];
				const keys = Object.keys(pages);
				return pages[keys[0]]['extract'];
			})(),
		};
		const myembed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(info.title)
			.setURL(info.url)
			.setDescription(info.summary);

		return await interaction.editReply({ embeds: [myembed] });
	},
};