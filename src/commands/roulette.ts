import type { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

const { SlashCommandBuilder } = require('discord.js');

const cylinderRounds = new Map();
const priorityPlayers = new Map();
const timers = new Map();

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

		if (!cylinderRounds.has(guildId)) cylinderRounds.set(guildId, 0);
		if (subcommand === 'load') {
			const rounds = interaction.options.getInteger('rounds');
			if (cylinderRounds.get(guildId) > 0) return 'The cylinder must be empty to load it again';
			if (rounds < 1 || rounds > 6) return 'Number of rounds must be between one and six';

			priorityPlayers.set(guildId, interaction.user);
			timers.set(guildId, setTimeout(() => {
				cylinderRounds.set(guildId, 0);
				channel.send('Cylinder has been emptied.');
			}, 300_000));

			cylinderRounds.set(guildId, rounds);
			return `${rounds} rounds have been loaded into the cylinder.`;
		}
		else if (subcommand === 'spin') {
			return `The barrel has been spun. There are ${cylinderRounds.get(guildId)} rounds in the cylinder.`;
		}
		else if (subcommand === 'empty') {
			if (interaction.user.id === interaction.guild.ownerId) {
				cylinderRounds.set(guildId, 0);
				// remove priority user
				priorityPlayers.set(guildId, undefined);
				clearTimeout(timers.get(guildId));

				return 'The cylinder has been emptied';
			}
			return 'You cannot empty the cylinder';
		}
		else if (subcommand === 'fire') {
			if (priorityPlayers.get(guildId) !== undefined) {
				if (priorityPlayers.get(guildId).id == interaction.user.id) {
					priorityPlayers.set(guildId, undefined);
				}
				else {
					return `Player ${priorityPlayers.get(guildId).displayName} must fire first`;
				}
			}
			const r = Math.floor(Math.random() * 6) + 1;
			const rounds = cylinderRounds.get(guildId);
			if (rounds === undefined || rounds === 0) return 'There are currently no rounds in the cylinder';

			if (r >= 1 && r <= rounds) {
				interaction.member.voice.disconnect()
					.then((mem) => console.log(`${mem.displayName} has been disconnected from voice chat`))
					.catch(err => console.error('Unable to disconnect user', err));
				interaction.member.timeout(TIMEOUT_DURATION, 'This player is deceased')
					.then(mem => console.log(`${mem.displayName} has been timed out`))
					.catch(err => console.error('Unable to timeout user\n', err));
				if (rounds == 1) {
					cylinderRounds.set(guildId, 0);
					clearTimeout(timers.get(guildId));
					return `${interaction.member.displayName} has died.\nThe cylinder has been emptied.`;
				}
				else {
					cylinderRounds.set(guildId, rounds - 1);
					return `${interaction.member.displayName} has died.`;
				}
			}
			return `${interaction.member.displayName} survives.\n${cylinderRounds.get(guildId)} round(s) remain`;
		}
	},
};