const { Events } = require('discord.js');

let bReady = false;
let phrases;

try {
	phrases = require('./databases/responses');
	if (phrases.length == 0) throw new Error('NO RESPONSES');
	bReady = true;
}
catch (e) {
	console.error(e);
}

function randint(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
	type: Events.MessageCreate,
	once: false,
	execute(message) {
		if (message.author.bot || bReady == false) return;
		const botID = message.client.user.id;
		const userMentions = message.mentions.users;

		if (userMentions.has(botID)) {
			message.channel.send(phrases[randint(0, phrases.length)]);
		}
	},
};