import type { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import RRoulette from "../RRoulette";

const { SlashCommandBuilder } = require('discord.js');
const game = new RRoulette();
let timer: string | number | NodeJS.Timeout | undefined = undefined;

const TIMEOUT_DURATION = 60_000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription('Play a game of Russian Roulette')
		.addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
			subcommand.setName('load')
				.setDescription('Load rounds into the cylinder')
				.addIntegerOption(option =>
					option.setName('rounds')
						.setDescription('Number of rounds to load')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
			subcommand.setName('spin')
				.setDescription('Spin the cylinder'),
		)
		.addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
			subcommand.setName('empty')
				.setDescription('Empty the cylinder'),
		)
		.addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
			subcommand.setName('fire')
				.setDescription('Fire the weapon'),
		),
	helpMessage: '',
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns
	 */
	async execute(interaction: ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();
		const guildId = interaction.guildId, channel = interaction.channel;
		if (!interaction.inGuild()) return 'Cannot be used outside of a guild';

		if (subcommand === 'load') {
			const rounds = interaction.options.getInteger('rounds', true);
			if (game.isEmpty()) return 'The cylinder must be empty to load it again';
			if (rounds < 1 || rounds > 6) return 'Number of rounds must be between one and six';

			game.init(interaction.user.id, rounds);
			timer = setTimeout(() => {
				game.empty();
				channel?.send('Cylinder has been Emptied');
			}, 300_000);
	
			return `${rounds} rounds have been loaded into the cylinder.`;
		}
		else if (subcommand === 'spin') {
			return `The barrel has been spun. There are ${game.rounds} rounds in the cylinder.`;
		}
		else if (subcommand === 'empty') {
			if (interaction.user.id === interaction.guild?.ownerId) {
				game.empty();
				clearTimeout(timer);

				return 'The cylinder has been emptied';
			}
			return 'You cannot empty the cylinder';
		}
		else if (subcommand === 'fire') {
			if (game.isEmpty()) return 'The cylinder is currently empty';
			const member = interaction.guild?.members.cache.get(interaction.user.id);

			if (game.priorityPlayer && game.priorityPlayer !== interaction.user.id) return `Player ${interaction.guild?.members.cache.get(game.priorityPlayer)?.displayName} must fire first`;
			game.priorityPlayer = undefined;

			const success = game.fire();

			if (success) {
				member?.voice.disconnect()
					.then((mem) => console.log(`${mem.displayName} has been disconnected from voice chat`))
					.catch(err => console.error('Unable to disconnect user', err));
				member?.timeout(TIMEOUT_DURATION, 'This player is deceased')
					.then(mem => console.log(`${mem.displayName} has been timed out`))
					.catch(err => console.error('Unable to timeout user\n', err));
				
				if (game.isEmpty()) {
					clearTimeout(timer);
					return `${member?.displayName} has died.\nThe cylinder has been emptied.`;
				}
				else {
					return `${member?.displayName} has died.`;
				}
			}
			return `${member?.displayName} survives.\n${game.rounds} round(s) remain`;
		}
	},
};