const { writeFile } = require('fs/promises');
const { join } = require('path');

class ConfigManager {
	constructor(guildId, guildName) {
		this.name = guildName;
		this.id = guildId;
		this.defaultRole = null;
		this.disabledCommands = {};
		this.restrictedCommands = {};
		this.disabledRoles = {};
		this.disabledUsers = {};
		this.disabledChannels = {};
	}

	save() {
		const data = {
			defaultRole: this.defaultRole,
			disabledCommands: this.disabledCommands,
			restrictedCommands: this.restrictedCommands,
			disabledRoles: this.disabledRoles,
			disabledUsers: this.disabledUsers,
			disabledChannels: this.disabledChannels,
		};
		const filename = join(process.cwd(), `./cfg/guilds/${this.id}.json`);
		writeFile(filename, JSON.stringify(data), { encoding: 'utf-8' })
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
			this.disabledRoles = data['disabledRoles'];
			this.disabledUsers = data['disabledUsers'];
			this.disabledChannels = data['disabledChannels'];
		}
		catch (e) {
			console.error(`Unable to load guild config file ${this.id}.json`);
		}
	}

	auth(authProps = {}) {
		for (const key in authProps) {
			const name = authProps[key];
			if (key == 'command') { this.restrictedCommands[authProps[key]] = false; }
			else if (key == 'role') { this.disabledRoles[name] = false; }
			else if (key == 'user') { this.disabledUsers[name] = false; }
			else if (key == 'channel') { this.disabledChannels[name] = false; }
		}
		this.save();
	}

	deauth(authProps = {}) {
		for (const key in authProps) {
			const name = authProps[key];
			if (key == 'command') { this.restrictedCommands[name] = true; }
			else if (key == 'role') { this.disabledRoles[name] = true; }
			else if (key == 'user') { this.disabledUsers[name] = true; }
			else if (key == 'channel') { this.disabledChannels[name] = true; }
		}
		this.save();
	}

	enableCommand(commandName) {
		this.disabledCommands[commandName] = false;
		this.save();
	}

	disableCommand(commandName) {
		this.disabledCommands[commandName] = true;
		this.save();
	}
}

module.exports = ConfigManager;