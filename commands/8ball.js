const { SlashCommandBuilder } = require('discord.js');

const responses = [
	'It is certain',
	'It is decidedly so',
	'Without a doubt',
	'Yes definitely',
	'You may rely on it',
	'As I see it, yes',
	'Most likely',
	'Outlook good',
	'Yes',
	'Signs point to yes',
	'Reply hazy, try again',
	'Ask again later',
	'Better not tell you now',
	'Cannot predict now',
	'Concentrate and ask again',
	'Don\'t count on it',
	'My reply is no',
	'My sources say no',
	'Outlook not so good',
	'Very doubtful',
	'Maybe someday',
	'Nothing',
	'You cannot get to the top by sitting on your bottom',
	'I see a new sauce in your future',
	'Follow the seahorse',
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Query the Magic 8ball')
		.addStringOption(option =>
			option
				.setName('question')
				.setDescription('Ask your question'),
		),
	helpMessage: '',
	async execute(interaction) {
		const q = interaction.options.getString('question');
		const r = responses[Math.floor(Math.random() * responses.length)];
		if (q == null || q == undefined) return `**${r}**`;
		else return `Q: ${q}\n**${r}**`;
	},
};