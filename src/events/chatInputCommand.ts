import { type ChatInputCommandInteraction, type Collection } from "discord.js";

// eslint-disable-next-line no-unused-vars
import { Events } from 'discord.js';
import type { BotEvent } from "../Interfaces";

const chatInputCommand: BotEvent = {
	type: Events.InteractionCreate,
	once: false,
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns null
	 */
	async execute(interaction: ChatInputCommandInteraction, commandData: Collection<string, (cmdInteraction: ChatInputCommandInteraction) => Promise<void | string>>) {
		if (!interaction.isChatInputCommand()) return;

		const command = commandData.get(interaction.commandName);
		if (!command) return;

		await interaction.deferReply();// make defer an option from the command
		const start = (new Date()).getTime();

		const guild = interaction.guild;
		const channel = interaction.channel;
		const cmdName = interaction.commandName;
		const date = interaction.createdAt;
		const username = interaction.user.username;
		const userId = interaction.user.id;
		const channelType = channel?.isDMBased() ?
								'DM' :
								channel?.isThread() ?
									'Thread' :
									channel?.isVoiceBased() ?
										'Voice' :
										interaction.inGuild() ? 
											'Guild Text' :
											'Unknown';
		const channelId = interaction.channelId;
		const channelName = interaction.inGuild() ?
								guild?.channels.cache.get(channelId)?.name || '[Name Unavailable]' :
								'N/A';
		const guildName = interaction.guild?.name || 'N/A';
		const guildId = interaction.guildId;

		console.log(
			`=> Command: ${cmdName}, At: ${date}\n`,
			`\t=> Username: ${username}, User ID: ${userId}\n`,
			`\t=> Channel Type: ${channelType}, Channel Name: ${channelName}, Channel ID: ${channelId}\n`,
			`\t=> Guild Name: ${guildName}, Guild ID: ${guildId}\n`,
		);
		command(interaction)
			.catch(error => {
				console.error(error);
				// this might need to be changed
				interaction.editReply({
					content: 'There was an error while executing this command!'
				});
			})
			.then(msg => {
				// this might need to be changed
				if (msg) interaction.editReply(msg);
			})
			.finally(() => {
				const delta = (new Date()).getTime() - start;
				console.log(`Execution finished in ${delta} ms`);
			})
	},
};
export default chatInputCommand