const { SlashCommandBuilder } = require('@discordjs/builders');
const mexp = require('math-expression-evaluator');

function randNum(max) {
	return Math.floor(Math.random() * max) + 1;
}
const diceRegex = /\d+d\d+/ig;
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
		const expressions = diceStr.split(' ');
		const reply = [];
		for (let i = 0; i < expressions.length; i++) {
			const arr = [];
			const die = expressions[i].match(diceRegex)[0];
			if (die == null) continue;
			try {
				const _str = die.split('d');
				const quantity = parseInt(_str[0]);
				const range = parseInt(_str[1]);
				const strMod = expressions[i].replace(diceRegex, '');
				const modifier = mexp.eval(strMod == '' ? '0' : strMod);

				for (let j = 0; j < quantity; j++) {
					arr.push(randNum(range));
				}
				const max = range;
				const min = 1;
				const length = arr.length;
				reply.push(`\`\`\`bash\n${expressions[i]}: (` + arr.reduce((prev, curr, idx) => {
					let str = prev;
					if (curr == max) {
						str += `'${curr}'`;
					}
					else if (curr == min) {
						str += `$${curr}`;
					}
					else {
						str += `${curr}`;
					}

					if (idx == length - 1) return str;
					else return str + ' + ';
				}, '') + `) + ${modifier} = ${arr.reduce((x, y) => x + y, 0) + modifier}\`\`\`\n`);
			}
			catch (err) {
				console.log('FOUND AN ERROR', err);
				return interaction.reply({
					content: err.message,
					ephemeral: true,
				});
			}
		}

		return interaction.reply(reply.join('').trim());
	},
};