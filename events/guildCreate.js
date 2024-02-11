// eslint-disable-next-line no-unused-vars
const { Events, Guild } = require('discord.js');
const ConfigManager = require('../src/ConfigManager');

module.exports = {
	type: Events.GuildCreate,
	once: false,
	/**
	 *
	 * @param {Guild} guild
	 * @returns
	 */
	async execute(guild) {
		const config = new ConfigManager(guild.id, guild.name);
		config.load();
		guild.client.guildConfigs.set(guild.id, config);
	},
};