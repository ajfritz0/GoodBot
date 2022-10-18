const { readFile, readdir } = require('fs/promises');
const { resolve } = require('path');

let bReady = false;

const phrases = {
	generic: {},
	userCustom: {},
};

function randint(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

async function importData(filename) {
	try {
		const rawData = await readFile(filename, 'utf8');
		if (rawData.length == 0) return { error: 1, message: 'File contents empty' };

		const data = rawData.split('\n').filter(value => value.length > 0);
		return {
			error: null,
			data,
		};
	}
	catch (e) {
		return {
			error: 2,
			message: e,
		};
	}
}

(async () => {
	console.log('=====');
	const genericResponsePath = resolve('databases', 'generic_responses');
	const customUserReponsePath = resolve('databases', 'user_responses');
	const genericDirents = await readdir(genericResponsePath);
	const userDirents = await readdir(customUserReponsePath);
	for (const file of genericDirents) {
		const fileContents = await importData(resolve(genericResponsePath, file));
		if (fileContents.error) {
			console.error(fileContents.message);
		}
		else {
			phrases.generic[file] = fileContents.data;
		}
	}
	for (const file of userDirents) {
		const fileContents = await importData(resolve(customUserReponsePath, file));
		if (fileContents.error) {
			console.error(fileContents.message);
		}
		else {
			phrases.userCustom[file] = fileContents.data;
		}
	}
	console.log('=====');
	bReady = true;
})();

module.exports = message => {
	if (message.author.bot || bReady == false || Object.keys(phrases.generic).length == 0) return;
	const messageAuthorName = message.author.username;
	const botID = message.client.user.id;
	const chanName = message.channel.name;
	const userMentions = message.mentions.users;
	const guildName = message.guild.name;

	if (userMentions.has(botID)) {
		// check if the user has any custom responses
		// Failing that check, send a generic response to the author

		console.log(`Message Author: ${messageAuthorName} / Guild: ${guildName} Channel: ${chanName}`);
		let easteregg = 0;
		const usersWithReponses = Object.keys(phrases.userCustom);

		if (usersWithReponses.includes(messageAuthorName)) easteregg = randint(0, 100);

		if (easteregg == 99) {
			const userMessages = phrases.userCustom[messageAuthorName];
			message.channel.send(userMessages[randint(0, userMessages.length)]);
		}
		else {
			const genericKeys = Object.keys(phrases.generic);
			for (const key of genericKeys) {
				if (message.content.includes(key)) {
					const arr = phrases.generic[key];
					message.channel.send(
						arr[randint(0, arr.length)],
					);
					return;
				}
			}
			const key = genericKeys[randint(0, genericKeys.length)];
			const phraseArr = phrases.generic[key];
			message.channel.send(
				phraseArr[randint(0, phraseArr.length)],
			);
		}
	}
};