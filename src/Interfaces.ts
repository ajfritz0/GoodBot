import type { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface BotCommand {
	data: SlashCommandBuilder
	helpMessage: string

	isDeferred?: boolean
	isDMAllowed?: boolean
	isNSFW?: boolean
	defaultMemberPermission?: string | number | bigint

	execute: (interaction: ChatInputCommandInteraction) => Promise<string|void>
	autocomplete?: (interaction:AutocompleteInteraction) => Promise<void>
}

export interface BotEvent {
	type: string
	once: boolean
	execute: (EventObject?: any, ...args: any[]) => Promise<void>
}