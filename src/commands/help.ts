import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

const { SlashCommandBuilder } = require('discord.js');
import { readdirSync } from 'node:fs';

interface MessageStruct {
	[index: string]: {
		desc: string,
		info: string,
	},
}

const messages: MessageStruct = (() => {
	const files = readdirSync('./src/commands').filter(f => f.endsWith('.js') || f.endsWith('.ts'));
	const m: MessageStruct = {};
	for (const file of files) {
		const {data, helpMessage} = require(`./${file}`);
		m[data.name] = {
			desc: data.description,
			info: helpMessage,
		};
	}
	return m;
})();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Receive help on this bots functionality')
		.addStringOption((option: SlashCommandStringOption) => {
			return option.setName('cmd')
				.setDescription('Command Name');
		}),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const cmd = interaction.options.getString('cmd');

		if (cmd == null || cmd == undefined) {
			const helpMessage = [];
			const keys = Object.keys(messages);
			for (const key of keys) {
				helpMessage.push(`"${key}": ${messages[key]?.desc}\n`);
			}
			return `\`\`\`bash\n${helpMessage.join('')}\`\`\``;
		}
		else {
			const msg = messages[cmd];
			return (!msg) ? 'That commands does not exist' : `\`\`\`bash\n${msg.info}\`\`\``;
		}
	},
};