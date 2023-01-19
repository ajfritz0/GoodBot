const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('../cfg/config.json');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
client.autoComplete = new Collection();
client.MusicPlayerCollection = new Collection();
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const eventName = file.slice(0, -3);
	console.log(`Loading event module: ${file}`);
	const cb = require(`../events/${file}`);

	client.on(eventName, cb);
}
for (const file of commandFiles) {
	console.log(`Loading Module ${file}`);
	const command = require(`../commands/${file}`);
	client.commands.set(command.data.name, command.execute);
	if (command.autoComplete) client.autoComplete.set(command.data.name, command.autoComplete);
}

client.once('ready', () => {
	console.log('Ready!');
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	const start = (new Date()).getTime();
	try {
		let consoleStr = `====================\n\tCommand Name: ${interaction.commandName} / User: ${interaction.user.username}\n`;
		if (interaction.channel) consoleStr += `\tChannel Name: ${interaction.channel.name} / Guild Name: ${interaction.guild.name}\n`;
		consoleStr += `Created At: ${interaction.createdAt.toString()}`;

		console.log(consoleStr);
		await command(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
	const delta = (new Date()).getTime() - start;
	console.log(`Execution finished in ${delta}ms`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isAutocomplete()) return;

	const command = client.autoComplete.get(interaction.commandName);
	if (!command) return;

	try {
		await command(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Error executing autocomplete' });
	}
});

client.login(token);