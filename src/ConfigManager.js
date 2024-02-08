const { writeFile } = require('fs/promises');
const { join } = require('path');

class ConfigManager {
	constructor(guildId, guildName) {
		this.name = guildName;
		this.id = guildId;
		this.defaultRole = null;
		this.disabledCommands = {};
		this.restrictedCommands = {};
		this.restrictedUsers = {};
		this.restrictedChannels = {};
	}

	save() {
		const data = {
			defaultRole: this.defaultRole,
			disabledCommands: this.disabledCommands,
			restrictedCommands: this.restrictedCommands,
			restrictedUsers: this.restrictedUsers,
			restrictedChannels: this.restrictedChannels,
		};
		const filename = join(process.cwd(), `./cfg/guilds/${this.id}.json`);
		writeFile(join(filename, JSON.stringify(data), { encoding: 'utf-8' }))
			.catch(err => {
				if (err) console.error(`[WRITE FAILURE] Unable to write to file ${filename}`);
			})
			.then(() => console.log(`Finished writing to ${filename}`));
	}

	load() {
		try {
			const data = require(join(process.cwd(), `./cfg/guilds/${this.id}.json`));
			this.defaultRole = data['defaultRole'];
			this.disabledCommands = data['disabledCommands'];
			this.restrictedCommands = data['restrictedCommands'];
			this.restrictedUsers = data['restrictedUsers'];
			this.restrictedChannel = data['restrictedChannels'];
		}
		catch (e) {
			console.error(`Unable to load guild config file ${this.id}.json`);
		}
	}

	addDefaultRole(roleId) {
		this.defaultRole = roleId;
		this.save();
	}
	enableCommand(name) {
		this.disabledCommands[name] = false;
		this.save();
	}
	disableCommand(name) {
		this.disabledCommands[name] = true;
		this.save();
	}
	restrictCommand(name) {
		this.restrictedCommands[name] = true;
		this.save();
	}
	unrestrictCommand(name) {
		this.restrictedCommands[name] = false;
		this.save();
	}
	restrictUser(userId) {
		this.restrictedUsers[userId] = true;
		this.save();
	}
	unrestrictUser(userId) {
		this.restrictedUsers[userId] = false;
		this.save();
	}
	restrictChannel(channelId) {
		this.restrictedChannels[channelId] = true;
		this.save();
	}
	unrestrictChannel(channelId) {
		this.restrictedChannels[channelId] = false;
		this.save();
	}
}

module.exports = ConfigManager;