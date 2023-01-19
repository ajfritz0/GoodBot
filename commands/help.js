const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

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
			'"/wiki": Pulls a wikipedia article based on a query\n';
		const embed = new EmbedBuilder()
			.setDescription('```bash\n' + str + '```');
		interaction.reply({
			embeds: [embed],
		});
	},
};