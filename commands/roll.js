const { SlashCommandBuilder } = require('@discordjs/builders');

function randNum(max) {
	return Math.floor(Math.random() * max) + 1;
}
const diceRegex = /\d+d\d+/i;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll a number of multi-sided dice')
		.addStringOption((option) =>
			option.setName('dice')
				.setDescription('Default: 1d6'),
		),
	async execute(interaction) {
		const diceStr = interaction.options.getString('dice') || '1d6';
		const dice = diceStr
			.split(' ')
			.map(val => val.match(diceRegex)[0])
			.filter(val => val !== null);
		console.log(dice);
		let reply = '';
		for (let i = 0; i < dice.length; i++) {
			const die = dice[i].split('d');
			const numOfRolls = parseInt(die[0]) % 101;
			const dieSize = parseInt(die[1]) % 101;
			for (let j = 0; j < numOfRolls; j++) reply += `${randNum(dieSize)} `;
			reply += '\n';
		}
		console.log(reply);

		return await interaction.reply(reply.trim());
	},
};