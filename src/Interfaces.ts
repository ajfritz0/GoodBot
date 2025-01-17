import type { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type SlashCommand = SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;

export interface BotCommand {
	data: SlashCommand
	helpMessage: string

	execute: (interaction: ChatInputCommandInteraction) => Promise<string|void>
	autocomplete?: (interaction:AutocompleteInteraction) => Promise<void>
}

export interface BotEvent {
	type: string
	once: boolean
	execute: (EventObject?: any, ...args: any[]) => Promise<void>
}