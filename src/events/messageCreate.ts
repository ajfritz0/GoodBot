import type { Message, MessageCreateOptions, MessagePayload } from "discord.js";

import { Events } from 'discord.js';
import type { BotEvent } from "../Interfaces";

type MsgPayload = string | MessageCreateOptions | MessagePayload;

function randint(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min;
}

class PhraseGenerator {
	phrases: Array<string>;
	size: number;
	constructor() {
		try{
			this.phrases = require('../../databases/responses');
			if (this.phrases.length == 0) this.size = this.phrases.length;
			else this.size = 0;
		}
		catch (e) {
			this.phrases = [];
			this.size = 0;
			throw e;
		}
	}
	getPhrase(): MsgPayload {
		return this.phrases.at(randint(0,this.size)) || '';
	}
}

const phraseCollection = new PhraseGenerator();

const messageCreate: BotEvent = {
	type: Events.MessageCreate,
	once: false,
	async execute(message: Message) {
		if (message.author.bot || phraseCollection.size == 0) return;
		const botID = message.client.user.id;
		const userMentions = message.mentions.users;

		if (userMentions.has(botID)) {
			message.channel.send(phraseCollection.getPhrase());
		}
	},
};
export default messageCreate;