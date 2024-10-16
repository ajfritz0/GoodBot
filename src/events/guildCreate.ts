import type { Guild } from "discord.js";

// eslint-disable-next-line no-unused-vars
import { Events } from 'discord.js';
import type { BotEvent } from "../Interfaces";

const guildCreate: BotEvent = {
	type: Events.GuildCreate,
	once: false,
	/**
	 *
	 * @param {Guild} guild
	 * @returns
	 */
	async execute(guild: Guild) {
		return;
	},
};
export default guildCreate;