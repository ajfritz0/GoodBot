const ytdl = require('ytdl-core-discord');
const Queue = require('./Queue');

const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

module.exports = class MusicPlayer {
	constructor() {
		this.player = createAudioPlayer();
		this.connection = null;
		this.timer = null;
		this.stream = null;
		this.tracks = new Queue();
		this.lastTrack = null;

		const setTimer = () => {
			this.timer = setTimeout(this.destroy.bind(this), 5 * 60 * 1000);
		};
		this.player.on(AudioPlayerStatus.Idle, async () => {
			this.playNextTrack();
			setTimer();
		});
		this.player.on(AudioPlayerStatus.Paused, setTimer);
		this.player.on(AudioPlayerStatus.Playing, () => {
			if (this.timer !== null) clearTimeout(this.timer);
		});

		this.player.on('error', console.error);

		this._interaction = null;
	}

	addTrack(url) {
		const isValid = ytdl.validateURL(url);
		if (!isValid) throw 'That is not a valid URL';
		this.tracks.enqueue(url);
	}
	async playNextTrack() {
		if (this.tracks.isEmpty()) return -1;

		this.lastTrack = this.tracks.dequeue();
		this.play(this.lastTrack);
	}
	getNextTrack() {
		const next = this.tracks.peak();
		return (next === null) ? '<Empty>' : next;
	}
	async play(url) {
		if (url === null || url === undefined) url = this.lastTrack || this.getNextTrack();

		const isValid = ytdl.validateURL(url);
		if (!isValid) throw 'No valid URL provided.';
		this.lastTrack = url;

		this.stop();
		this.player.play(await this.createStream(url));
	}
	togglePause() {
		const status = this.getStatus();
		if (status == AudioPlayerStatus.Idle) return;
		if (status == AudioPlayerStatus.Paused) this.player.unpause();
		else this.player.pause();
	}

	getStatus() {
		return this.player.state.status;
	}

	stop() {
		if (this._interaction !== null) {
			this._interaction.deleteReply();
			this._interaction = null;
		}
		if (this.player.state !== AudioPlayerStatus.Idle) this.player.stop();
		if (this.stream !== null) {
			this.stream.destroy();
			this.stream = null;
		}
	}

	joinVC(chId, gId, adap) {
		if (this.connection !== null) return;
		this.connection = joinVoiceChannel({
			channelId: chId,
			guildId: gId,
			adapterCreator: adap,
		});

		this.connection.on('stateChange', (oldState, newState) => {
			if (newState.status == 'destroyed') {
				this.stop();
			}
		});
		this.connection.subscribe(this.player);
	}

	async createStream(url) {
		this.stream = await ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25 });
		return createAudioResource(this.stream, { inputType: StreamType.Arbitrary });
	}

	destroy() {
		this.stop();
		if (this.connection !== null) {
			this.connection.destroy();
			this.connection = null;
		}
	}

	async getTitle(url) {
		return (await ytdl.getBasicInfo(url)).player_response.videoDetails.title;
	}
};