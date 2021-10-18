const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const getRandomIndex = (struct) => {
	return struct[Math.floor(Math.random() * struct.length)];
};

const getRandomThreadText = async (board) => {
	return new Promise((resolve, reject) => {
		if (!board || typeof board !== 'string') {
			reject(new Error('Bad board :('));
		}

		axios.get(`https://a.4cdn.org/${board}/catalog.json`)
			.then((response) => {
				const { data } = response;
				const page = getRandomIndex(data);
				const thread = getRandomIndex(page.threads);
				resolve(thread.com);
			})
			.catch((error) => {
				reject(new Error('Could not complete request'));
			});
	});
};
module.exports = {
	data: new SlashCommandBuilder()
		.setName('4chan')
		.setDescription('4chan module')
		.addStringOption(option =>
			option.setName('board')
				.setDescription('The board to pull from')
				.setRequired(true),
		),
	async execute(interaction) {
		const board = interaction.options.getString('board');
		const data = await getRandomThreadText(board);
		return await interaction.reply((typeof data == 'string') ? data : 'Error: input must be of time string');
	},
};