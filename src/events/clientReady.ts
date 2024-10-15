import type { Client } from "discord.js";

// eslint-disable-next-line no-unused-vars
const { Events } = require('discord.js');
const { ConfigManager } = require('../ConfigManager');

export default {
	type: Events.ClientReady,
	once: true,
	/**
	 *
	 * @param {Client} client
	 */
	execute(client: Client) {
		const guilds = client.guilds.cache;
		for (const [snowflake, guild] of guilds) {
			const config = new ConfigManager(snowflake, guild.name);
			config.load();
			client.guildConfigs.set(snowflake, config);
		}
	},
};