const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('../cfg/config.json');

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	const idList = (await rest.get(Routes.applicationGuildCommands(clientId, guildId)))
		.map(x => x.id);

	for (const id of idList) {
		try {
			console.log(`Deleting command with id ${id}`);
			await rest.delete(Routes.applicationGuildCommand(clientId, guildId, id));
		}
		catch (e) {
			console.log(e);
			return;
		}
	}
})();