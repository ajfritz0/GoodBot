const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Receive help on this bots functionality'),
	async execute(interaction) {
		const str =
			'General Commands:\n' +
			'"/4chan": Pull a random post from 4chan a board\n' +
			'"/date": Returns the current date and time\n' +
			'"/flip": Flips a coin\n' +
			'"/hackernews": Pulls articles from HackerNews\n' +
			'"/help": Displays this message\n' +
			'"/imgur": Pull a random image from imgur\n' +
			'"/murder": MURDER\n' +
			'"/random": Rolls a random number (default 0-100)\n' +
			'"/roll": Rolls some dice (default 1d6)\n' +
			'"/timer": Sends a timed message to the channel\n' +
			'"/wiki": Pulls a wikipedia article based on a query\n' +
			'Music Player Commands:\n' +
			'\t"/play": Play or queue a youtube link\n' +
			'\t"/pause": Pause music\n' +
			'\t"/skip": Skip to new track\n' +
			'\t"/stop": Stop the music\n' +
			'\t"/clear": Clear the playlist\n' +
			'\t"/queue": View music queue\n' +
			'\t"/shuffle": Shuffle playlist\n';
		const embed = new MessageEmbed()
			.setDescription('```bash\n' + str + '```');
		interaction.reply({
			embeds: [embed],
		});
	},
};