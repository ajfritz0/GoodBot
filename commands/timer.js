const { SlashCommandBuilder } = require('@discordjs/builders');
const sch = require('node-schedule');
// const { writeFile } = require('fs/promises');

const _timers = {};

function createUID() {
	const min = 100000000;
	const max = 1000000000;
	return (Math.floor(Math.random() * (max - min) + min)).toString();
}

function createTimer(date, msg, cb) {
	const now = (new Date()).getTime();
	let _id = createUID();
	if (now > date.getTime()) return false;

	while (Object.keys(_timers).includes(_id)) _id = createUID();
	sch.scheduleJob(_id, date, cb).on('run', () => removeTimer(_id));

	if (msg.length > 30) msg = msg.slice(0, 27) + '...';
	_timers[_id] = {
		msg,
		date,
	};
	return true;
}

function removeTimer(id) {
	if (id === null || id === undefined || _timers[id] === null) return false;
	sch.cancelJob(id);
	delete _timers[id];
	return true;
}

function listTimers() {
	const keys = Object.keys(_timers);
	if (keys.length == 0) return 'No Timers';
	const str = keys.reduce((acc, val) => {
		return acc + `${val} : ${_timers[val].date.toLocaleTimeString()} : ${_timers[val].msg}`;
	}, '');
	return str;
}


module.exports = function(client) {

	if (client !== null) {
		client.once('ready', () => {
			console.log('Timer Module Ready');
			return;
		});
	}
	return {
		data: new SlashCommandBuilder()
			.setName('timer')
			.setDescription('Sends a messages at a specific time and date')
			.addSubcommand(subcommand =>
				subcommand.setName('list')
					.setDescription('Returns a list of active timers'))
			.addSubcommand(subcommand =>
				subcommand.setName('add')
					.setDescription('Add a new timer')
					.addStringOption(option =>
						option.setName('msg')
							.setDescription('Message')
							.setRequired(true))
					.addIntegerOption(option =>
						option.setName('mins')
							.setDescription('Minutes'))
					.addIntegerOption(option =>
						option.setName('hours')
							.setDescription('Hours'))
					.addIntegerOption(option =>
						option.setName('day')
							.setDescription('Day'))
					.addIntegerOption(option =>
						option.setName('month')
							.setDescription('Month')))
			.addSubcommand(subcommand =>
				subcommand.setName('rem')
					.setDescription('Remove an active timer')
					.addStringOption(option =>
						option.setName('id')
							.setDescription('The timer id'))),
		async execute(interaction) {
			const op = interaction.options._hoistedOptions.reduce((acc, val) => {
				acc[val.name] = val.value;
				return acc;
			}, {});
			const channel = interaction.channel;
			const channelId = interaction.channelId;
			const now = new Date();
			const subcomm = interaction.options.getSubcommand();

			if (subcomm === 'list') {
				return await interaction.reply(listTimers());
			}
			else if (subcomm === 'add') {
				const year = now.getFullYear();
				const month = op['month'] - 1 || now.getMonth();
				const day = op['day'] || now.getDate();
				const hours = op['hours'] || now.getHours();
				const mins = op['mins'] || now.getMinutes();
				const date = new Date(year, month, day, hours, mins);
				const msg = op['msg'];
				const test = createTimer(date, msg, channel.send.bind(channel, msg));
				if (!test) return interaction.reply({ content: 'Unable to add timer', ephemeral: true });
				return await interaction.reply({ content: 'Your timer has been added', ephemeral: true });
			}
			else if (subcomm === 'rem') {
				if (removeTimer(op['id'])) return await interaction.reply('Timer removed');
				else return await interaction.reply({ content: 'There is no timer associated with that id', ephemeral: true });
			}
		},
	};
};