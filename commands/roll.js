const { SlashCommandBuilder } = require('discord.js');
const Evaluator = require('math-expression-evaluator');
const mexp = new Evaluator();

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
		)
		.addBooleanOption((option) => {
			return option.setName('hidden')
				.setDescription('Make the result visible only to the user');
		}),
	helpMessage: '',
	async execute(interaction) {
		const diceStr = interaction.options.getString('dice') || '1d6';
		const isHidden = interaction.options.getBoolean('hidden');
		const expressions = diceStr.split(' ');
		const reply = [];
		for (let i = 0; i < expressions.length; i++) {
			const die = expressions[i].match(diceRegex)[0];
			if (die == null) continue;
			try {
				const _str = die.split('d');
				const quantity = parseInt(_str[0]);
				const range = parseInt(_str[1]);
				const strMod = expressions[i].replace(diceRegex, '');
				const modifier = mexp.eval(strMod == '' ? '0' : strMod);
				reply.push(`\`\`\`bash\n${expressions[i]}: (`);
				let sum = 0;
				for (let j = 0; j < quantity; j++) {
					const num = randNum(range);
					if (num == range) reply.push(`'${num}'🎉`);
					else if (num == 1) reply.push(`$${num}💀`);
					else reply.push(num.toString());
					if (j != quantity - 1) reply.push('+');
					sum += num;
				}
				if (modifier === 0) reply.push(`) = ${sum}\`\`\`\n`);
				else reply.push(`) + ${modifier} = ${sum + modifier}\`\`\`\n`);
			}
			catch (err) {
				console.log('FOUND AN ERROR', err);
				return interaction.reply({
					content: err.message,
					ephemeral: true,
				});
			}
		}

		interaction.reply({ content: reply.join(' ').trim(), ephemeral: isHidden });
	},
};