const { Client, Collection, GatewayIntentBits } = require('discord.js');
const config = require('../cfg/config.json');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
client.autoComplete = new Collection();
client.helpMessages = new Collection();
client.guildConfigs = new Collection();
const arrCommandData = [];
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	console.log(`Loading event module: ${file}`);
	const module = require(`./events/${file}`);

	if (module.once) {
		client.once(module.type, module.execute);
	}
	else {
		client.on(module.type, module.execute);
	}
}

for (const file of commandFiles) {
	console.log(`Loading Module ${file}`);
	const command = require(`./commands/${file}`);

	arrCommandData.push(command.data);
	client.commands.set(command.data.name, command.execute);

	if (command.autoComplete) client.autoComplete.set(command.data.name, command.autoComplete);

	client.helpMessages.set(command.data.name, {
		summary: command.data.description,
		message: command.helpMessage,
	});
}

require('./deploy')(arrCommandData)
	.then(() => {
		client.login(config['token']);
	})
	.catch(console.error);