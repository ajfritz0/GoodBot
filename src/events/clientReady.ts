import type { Client } from "discord.js";

// eslint-disable-next-line no-unused-vars
import { Events } from 'discord.js';
import type { BotEvent } from "../Interfaces";

const clientReady: BotEvent = {
	type: Events.ClientReady,
	once: true,
	/**
	 *
	 * @param {Client} client
	 */
	async execute(client: Client) {
		console.log('Ready!');
	},
};
export default clientReady;