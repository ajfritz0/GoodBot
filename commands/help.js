const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Receive help on this bots functionality')
		.addStringOption(option => {
			return option.setName('cmd')
				.setDescription('Command Name');
		}),
	helpMessage: '',
	async execute(interaction) {
		const cmd = interaction.options.getString('cmd');

		if (cmd == null || cmd == undefined) {
			const helpMessage = [];
			for (const [key, value] of interaction.client.helpMessages) {
				helpMessage.push(`"${key}": ${value.summary}\n`);
			}
			return `\`\`\`bash\n${helpMessage.join('')}\`\`\``;
		}
		else {
			const msg = interaction.client.helpMessages.get(cmd);
			if (msg == null || msg == undefined) return { content: 'That commands does not exist', ephemeral: true };
			else return `\`\`\`bash\n${msg.message}\`\`\``;
		}
	},
};