const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./cfg/config.json');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	console.log(`Loading event module: ${file}`);
	require(`./events/${file}`)(client);
}
for (const file of commandFiles) {
	console.log(`Loading Module ${file}`);
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, async (action) => {
		const start = (new Date()).getTime();
		console.log(`User Interaction: ${action.commandName} / User: ${action.user.username}`);
		console.log(`Channel Name: ${action.channel.name} / Guild Name: ${action.guild.name}`);
		console.log(`Created At: ${action.createAt.toString()}`);
		await command.execute(action);
		const delta = (new Date()).getTime() - start;
		console.log(`Execution finished in ${delta}ms`);
	});
}


client.once('ready', () => {
	console.log('Ready!');
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);