const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

class Bot {
	#token = null;
	constructor(token) {
		this.#token = token;
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages],
		});

		this.client.commands = new Collection();
		this.client.autoComplete = new Collection();
		this.client.helpMessages = new Collection();
		this.client.guildConfigs = new Collection();

		const arrCommandData = [];
		const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of eventFiles) {
			console.log(`Loading event module: ${file}`);
			try {
				const eventModule = require(`../events/${file}`);
				if (eventModule.once) {
					this.client.once(eventModule.type, eventModule.execute);
				}
				else {
					this.client.on(eventModule.type, eventModule.execute);
				}
			}
			catch (e) {
				console.log(`Failed to load module: ${file}`);
			}
		}

		for (const file of commandFiles) {
			console.log(`Loading Command module: ${file}`);
			try {
				const commandModule = require(`../commands/${file}`);
				arrCommandData.push(commandModule.data);
				this.client.commands.set(commandModule.data.name, commandModule.execute);

				if (commandModule.autoComplete) this.client.autoComplete.set(commandModule.data.name, commandModule.autoComplete);

				this.client.helpMessages.set(commandModule.data.name, {
					summary: commandModule.data.description,
					message: commandModule.helpMessage,
				});
			}
			catch (e) {
				console.log(`Failed to load module: ${file}`);
			}
		}
	}
}

module.exports = Bot;