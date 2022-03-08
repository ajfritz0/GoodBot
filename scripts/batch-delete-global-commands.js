const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('../cfg/config.json');

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	const idList = (await rest.get(Routes.applicationCommands(clientId)))
		.map(x => x.id);

	for (const id of idList) {
		try {
			console.log(`Deleting command with id ${id}`);
			await rest.delete(Routes.applicationCommand(clientId, id));
		}
		catch (e) {
			console.log(e);
			return;
		}
	}
})();