const MusicPlayer = require('../lib/MusicPlayer');

module.exports = (client) => {
	client.mp = new MusicPlayer();
};