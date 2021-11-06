const { SlashCommandBuilder } = require('@discordjs/builders');
const MarkovChain = require('../lib/Markov');
const { readFile, writeFile } = require('fs/promises');
const path = require('path');
const sch = require('node-schedule');

const dbPath = path.resolve(process.cwd(), 'databases/markovdb.json');
const activeChannels = [];

module.exports = function(client) {
	const chain = new MarkovChain();
	readFile(dbPath, { encoding: 'utf8' })
		.then(data => chain._bank = JSON.parse(data))
		.catch(console.error);

	client.on('messageCreate', message => {
		if (!activeChannels.includes(message.channelId)) return;

		chain.addPhrase(message.content);
	});

	sch.scheduleJob('0 */4 * * *', () => {
		console.log('Beginning database write');
		writeFile(dbPath, JSON.stringify(chain._bank))
			.then(() => console.log('Database write complete'))
			.catch(console.error);
	});
	return {
		data: new SlashCommandBuilder()
			.setName('markov')
			.setDescription('Markov Chain Text Generator'),
		async execute(interaction) {
			const _id = interaction.channelId;
			if (!activeChannels.includes(_id)) activeChannels.push(_id);

			return interaction.reply(chain.getPhrase());
		},
	};
};