const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('../cfg/config.json');

const rest = new REST({ version: '9' }).setToken(token);


rest.get(Routes.applicationCommands(clientId))
	.then((data) => console.log(data))
	.catch(console.error);
/*

rest.delete(Routes.applicationGuildCommand(clientId, guildId, '898052620747436033'))
	.then(() => console.log('Deletion Successful'))
	.catch(console.error);
*/