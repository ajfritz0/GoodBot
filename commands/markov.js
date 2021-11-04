const { SlashCommandBuilder } = require('@discordjs/builders');
const MarkovChain = require('../lib/Markov');

const chain = new MarkovChain();

let isCollected = false;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('markov')
		.setDescription('Markov Chain Text Generator'),
	async execute(interaction) {
		if (isCollected == false) {
			await interaction.deferReply();
			let reply = '<EMPTY>';
			try {
				const messageCollection = await interaction.channel.messages.fetch({ limit: 100 });
				messageCollection
					.filter(m => m.type === 'DEFAULT')
					.forEach(m => chain.addPhrase(m.content));
				reply = chain.getPhrase();
			}
			catch (e) {
				console.log(e);
				reply = 'Unable to collect messages';
			}
			isCollected = true;
			return await interaction.editReply(reply);
		}
		return await interaction.reply(chain.getPhrase());
	},
};