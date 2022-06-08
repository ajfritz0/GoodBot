const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./cfg/config.json');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const eventName = file.slice(0, -3);
	console.log(`Loading event module: ${file}`);
	const cb = require(`./events/${file}`);

	client.on(eventName, cb);
}
for (const file of commandFiles) {
	console.log(`Loading Module ${file}`);
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const MusicPlayer = require('./lib/MusicPlayer');
client.mp = new MusicPlayer();

client.once('ready', () => {
	console.log('Ready!');
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	const start = (new Date()).getTime();
	try {
		console.log(`User Interaction: ${interaction.commandName} / User: ${interaction.user.username}`);
		console.log(`Channel Name: ${interaction.channel.name} / Guild Name: ${interaction.guild.name}`);
		console.log(`Create At: ${interaction.createdAt.toString()}`);
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
	const delta = (new Date()).getTime() - start;
	console.log(`Execution finished in ${delta}ms`);
});

client.login(token);