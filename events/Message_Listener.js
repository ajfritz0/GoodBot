const goodFortunes = [
	'Your dream will come true',
	'A good way to keep healthy is to eat more Chinese food',
	'A journey of a thousand miles begins with a single step',
	'A new voyage will fill your life with untold memories',
	'A short stranger will soon enter your life with blessings to share',
];
const badFortunes = [
	'You will die alone and poorly dressed.',
	'That wasn\'t chicken',
	'Run!',
	'Don\'t talk to me or my son again',
	'Your life is fleeting',
];
module.exports = (client) => {
	client.on('messageCreate', message => {
		if (message.author.bot) return;

		message.channel.send((Math.floor(Math.random() * 2) == 0)
			? goodFortunes[Math.floor(Math.random() * goodFortunes.length)]
			: badFortunes[Math.floor(Math.random() * badFortunes.length)]);
	});
};