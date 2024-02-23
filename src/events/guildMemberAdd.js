// eslint-disable-next-line no-unused-vars
const { Events, GuildMember } = require('discord.js');

module.exports = {
	type: Events.GuildMemberAdd,
	once: false,
	/**
	 *
	 * @param {GuildMember} member
	 * @returns null
	 */
	execute(member) {
		const role = member.client.guildConfigs.get(member.guild.id).defaultRole;

		member.roles.add(role)
			.catch((err) => {
				console.error(`Unable to assign role with id ${role}\n`, err);
			});
	},
};