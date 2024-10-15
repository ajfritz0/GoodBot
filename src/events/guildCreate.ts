import type { Guild } from "discord.js";

// eslint-disable-next-line no-unused-vars
const { Events } = require('discord.js');
const ConfigManager = require('../ConfigManager');

module.exports = {
	type: Events.GuildCreate,
	once: false,
	/**
	 *
	 * @param {Guild} guild
	 * @returns
	 */
	async execute(guild: Guild) {
		const config = new ConfigManager(guild.id, guild.name);
		config.load();
		guild.client.guildConfigs.set(guild.id, config);
	},
};