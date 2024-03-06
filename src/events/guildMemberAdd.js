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

		if (!role) return console.log('No default role has been set');
		member.roles.add(role.id)
			.catch((err) => {
				console.error(`Unable to add role "${role.name}" to user ${member.nickname}`);
				console.error(err);
			});
	},
};