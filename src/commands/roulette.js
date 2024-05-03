// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

const cylinderRounds = new Map();
const priorityPlayers = new Map();

/*
	Speak russian
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription('Play a game of Russian Roulette')
		.addSubcommand(subcommand =>
			subcommand.setName('load')
				.setDescription('Load rounds into the cylinder')
				.addIntegerOption(option =>
					option.setName('rounds')
						.setDescription('Number of rounds to load')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('spin')
				.setDescription('Spin the cylinder'),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('empty')
				.setDescription('Empty the cylinder'),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('fire')
				.setDescription('Fire the weapon'),
		),
	helpMessage: '',
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns
	 */
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (!cylinderRounds.has(interaction.guildId)) cylinderRounds.set(interaction.guildId, 0);
		if (subcommand === 'load') {
			const rounds = interaction.options.getInteger('rounds');
			if (cylinderRounds.get(interaction.guildId) > 0) return 'The cylinder must be empty to load it again';
			if (rounds < 1 || rounds > 6) return 'Number of rounds must be between one and six';

			priorityPlayers.set(interaction.guildId, interaction.user);

			cylinderRounds.set(interaction.guildId, rounds);
			return `${rounds} rounds have been loaded into the cylinder.`;
		}
		else if (subcommand === 'spin') {
			return `The barrel has been spun. There are ${cylinderRounds.get(interaction.guildId)} rounds in the cylinder.`;
		}
		else if (subcommand === 'empty') {
			if (interaction.user.id === interaction.guild.ownerId) {
				cylinderRounds.set(interaction.guildId, 0);
				// remove priority user
				priorityPlayers.set(interaction.guildId, undefined);

				return 'The cylinder has been emptied';
			}
			return 'You cannot empty the cylinder';
		}
		else if (subcommand === 'fire') {
			if (priorityPlayers.get(interaction.guildId) !== undefined) {
				if (priorityPlayers.get(interaction.guildId).id == interaction.user.id) {
					priorityPlayers.set(interaction.guildId, undefined);
				}
				else {
					return `Player ${priorityPlayers.get(interaction.guildId).nickname} must fire first`;
				}
			}
			const r = Math.floor(Math.random() * 6) + 1;
			const rounds = cylinderRounds.get(interaction.guildId);
			if (rounds === undefined || rounds === 0) return 'There are currently no rounds in the cylinder';

			if (r >= 1 && r <= rounds) {
				interaction.member.voice.disconnect()
					.then((mem) => console.log(`${mem.displayName} has been disconnected from voice chat`))
					.catch(err => console.error('Unable to disconnect user', err));
				interaction.member.timeout(300_000, 'This player is deceased')
					.then(mem => console.log(`${mem.displayName} has been timed out`))
					.catch(err => console.error('Unable to timeout user\n', err));
				if (rounds == 1) {
					cylinderRounds.set(interaction.guildId, 0);
					return `${interaction.member.displayName} has died.\nThe cylinder has been emptied.`;
				}
				else {
					cylinderRounds.set(interaction.guildId, rounds - 1);
					return `${interaction.member.displayName} has died.`;
				}
			}
			return `${interaction.member.displayName} survives.\n${cylinderRounds.get(interaction.guildId)} round(s) remain`;
		}
	},
};