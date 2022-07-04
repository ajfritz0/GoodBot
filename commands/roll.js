const { SlashCommandBuilder } = require('@discordjs/builders');

function randNum(max) {
	return Math.floor(Math.random() * max) + 1;
}
const diceRegex = /\d+d\d+(\+\d+)?/ig;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll a number of multi-sided dice')
		.addStringOption((option) =>
			option.setName('dice')
				.setDescription('Default: 1d6'),
		),
	async execute(interaction) {
		const diceStr = interaction.options.getString('dice') || '';
		const dice = diceStr.match(diceRegex) || ['1d6'];
		const reply = [];
		for (let i = 0; i < dice.length; i++) {
			const arr = [];
			const _s = dice[i].split('d');
			const _t = _s[1].split('+');
			const die = [parseInt(_s[0]), parseInt(_t[0]), (!_t[1]) ? 0 : parseInt(_t[1])];
			const numOfRolls = die[0];
			const dieSize = die[1];
			const modifier = die[2];

			for (let j = 0; j < numOfRolls; j++) arr.push(randNum(dieSize) + modifier);
			const max = dieSize + modifier;
			const min = 1 + modifier;
			reply.push(`\`\`\`bash\n${dice[i]}: ` + arr.reduce((prev, curr) => {
				return (prev + ((curr == max) ? `'${curr}'` : (curr == min) ? `$${curr}` : `${curr}`)) + ' ';
			}, '') + '```\n');
		}

		return await interaction.reply(reply.join('\n').trim());
	},
};