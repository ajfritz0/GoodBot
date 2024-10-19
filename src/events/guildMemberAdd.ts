import type { GuildMember } from "discord.js";

import { Events } from 'discord.js';
import type { BotEvent } from "../Interfaces";

const guildMemberAd: BotEvent = {
	type: Events.GuildMemberAdd,
	once: false,
	/**
	 *
	 * @param {GuildMember} member
	 * @returns null
	 */
	async execute(member: GuildMember) {
		return;
	},
};

export default guildMemberAd;