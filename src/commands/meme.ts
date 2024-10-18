import { BotCommand } from "../Interfaces";

import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } from 'discord.js';
import type { ChatInputCommandInteraction, ColorResolvable } from "discord.js";
import axios from 'axios';

const randomColor = (): ColorResolvable => {
	const hex = '0123456789abcdef';
	const r = () => hex[Math.floor(Math.random() * 16)];
	return `#${[0,0,0,0,0,0].map(r).join('')}`;
};

const meme: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Show a random meme from reddit')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.UseApplicationCommands),
	helpMessage: '',
	async execute(interaction: ChatInputCommandInteraction) {
		const response = await axios.get('https://meme-api.com/gimme');

		if (response['status'] !== 200) return 'Unable to fetch meme :(';

		const data = response['data'];
		const embed = new EmbedBuilder()
			.setTitle(data['title'])
			.setImage(data['url'])
			.setColor(randomColor())
			.setFooter({ text: `${data['author']} - /r/${data['subreddit']}` })
			.setURL(data['postLink']);
		interaction.editReply({embeds: [embed]});
	},
};
module.exports = meme;