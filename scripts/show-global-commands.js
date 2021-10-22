const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('../cfg/config.json');

const rest = new REST({ version: '9' }).setToken(token);

rest.get(Routes.applicationCommands(clientId))
	.then((data) => console.log(data.filter(val => val.name == process.argv[2])))
	.catch(console.error);