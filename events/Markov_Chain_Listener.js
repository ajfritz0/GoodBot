const MarkovChain = require('../lib/Markov');
const { readFile, writeFile } = require('fs/promises');
const path = require('path');
const sch = require('node-schedule');

const dbPath = path.resolve(process.cwd(), 'databases/markovdb.json');

module.exports = (client) => {
	const chain = new MarkovChain();

	readFile(dbPath, { encoding: 'utf8' })
		.then(data => {
			chain._bank = JSON.parse(data);
		})
		.catch(console.error);

	client.on('messageCreate', message => {
		chain.addPhrase(message.content);

		if (message.author.bot) return;
		const users = message.mentions.users;
		const bot = users.find(user => user.bot);

		if (bot?.username == 'GodsEye') {
			message.channel.send(chain.getPhrase());
		}
	});

	sch.scheduleJob('0 */4 * * *', () => {
		console.log('Beginning database write');
		writeFile(dbPath, JSON.stringify(chain._bank))
			.then(() => console.log('Database write complete'))
			.catch(console.error);
	});
};