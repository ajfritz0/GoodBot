const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const randomColor = () => {
	const hex = '0123456789abcdef';
	const r = () => hex[Math.floor(Math.random() * 16)];
	return '#' + [0, 0, 0, 0, 0, 0].map(r).join('');
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Show a random meme from reddit'),
	helpMessage: '',
	async execute() {
		const response = await axios.get('https://meme-api.com/gimme');

		if (response['status'] !== 200) return 'Unable to fetch meme :(';

		const data = response['data'];
		const embed = new EmbedBuilder()
			.setTitle(data['title'])
			.setImage(data['url'])
			.setColor(randomColor())
			.setFooter({ text: `${data['author']} - /r/${data['subreddit']}` })
			.setURL(data['postLink']);
		return { embeds: [embed] };
	},
};