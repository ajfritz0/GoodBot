const { Events } = require('discord.js');

module.exports = {
	type: Events.MessageCreate,
	once: false,
	execute(msg) {
		if (msg.author.bot) return;
		msg.client.exchange.addBalance(msg.author.id, 1);
	},
};