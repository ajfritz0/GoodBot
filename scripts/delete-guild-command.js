const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('../cfg/config.json');

const rest = new REST({ version: '9' }).setToken(token);

rest.delete(Routes.applicationGuildCommand(clientId, guildId, process.argv[2]))
	.then(() => console.log('Deletion Successful'))
	.catch(console.error);