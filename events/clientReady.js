// eslint-disable-next-line no-unused-vars
const { Events, Client } = require('discord.js');
const ConfigManager = require('../src/ConfigManager');

module.exports = {
	type: Events.ClientReady,
	once: true,
	/**
	 *
	 * @param {Client} client
	 */
	execute(client) {
		const guilds = client.guilds.cache;
		for (const [snowflake, guild] of guilds) {
			const config = new ConfigManager(snowflake, guild.name);
			config.load();
			client.guildConfigs.set(snowflake, config);
		}
	},
};