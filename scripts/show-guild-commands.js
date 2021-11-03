const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('../cfg/config.json');

const rest = new REST({ version: '9' }).setToken(token);

if (process.argv.length > 2) {
	rest.get(Routes.applicationGuildCommands(clientId, guildId))
		.then((data) => console.log(data.filter(val => val.name == process.argv[2])))
		.catch(console.error);
}
else {
	rest.get(Routes.applicationGuildCommands(clientId, guildId))
		.then(data => console.log(data))
		.catch(console.error);
}