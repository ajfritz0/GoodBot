const ytdl = require('ytdl-core');
const PlaylistManager = require('./PlaylistManager');
const ytpl = require('ytpl');
const { MessageEmbed } = require('discord.js');

const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

const toTimeString = (seconds) => {
	const date = new Date(0);
	date.setSeconds(seconds);
	return `${date.getMinutes()}:${date.getSeconds()}`;
};

class MusicPlayer {
	constructor() {
		this.player = createAudioPlayer();
		this.connection = null;
		this.voiceChannelIdleTimer = null;
		this.stream = null;
		this.playlist = new PlaylistManager();
		this.isStopped = true;

		const setTimer = () => {
			this.voiceChannelIdleTimer = setTimeout(this.destroy.bind(this), 5 * 60 * 1000);
		};
		this.player.on(AudioPlayerStatus.Idle, () => {
			setTimer();
			if (this.isStopped) return;
			else this.playNext();
		});
		this.player.on(AudioPlayerStatus.Paused, setTimer);
		this.player.on(AudioPlayerStatus.Playing, () => {
			if (this.timer !== null) clearTimeout(this.voiceChannelIdleTimer);
		});

		this.player.on('error', console.error);
	}

	async add(url) {
		let insertionIndex = -1;
		if (ytdl.validateURL(url)) {
			try {
				const videoDetails = (await ytdl.getBasicInfo(url)).videoDetails;

				const trackItem = {
					title: videoDetails.title,
					duration: parseInt(videoDetails.lengthSeconds),
					video_url: videoDetails.video_url,
					author_name: videoDetails.author.name,
					author_channel: videoDetails.author.channel_url,
					thumbnail: videoDetails.author.thumbnails[0].url,
				};

				insertionIndex = this.playlist.playlist.length;
				this.playlist.addItem(trackItem);
			}
			catch (error) {
				console.error(error);
			}
		}

		else if (ytpl.validateID(url)) {
			try {
				const playlistDetails = await ytpl(url, { pages: 10 });
				const arr = [];

				playlistDetails.items.forEach((video) => {
					arr.push({
						title: video.title,
						duration: video.durationSec,
						video_url: video.shortUrl,
						author_name: video.author.name,
						author_channel: video.author.url,
						thumbnail: video?.bestThumbnail?.url,
					});
				});
				if (arr.length > 0) insertionIndex = this.playlist.playlist.length;
				this.playlist.addItems(arr);
			}
			catch (error) {
				console.error(error);
			}
		}
		return insertionIndex;
	}

	play(url) {
		this.stop();
		this.player.play(this.createStream(url));
		this.isStopped = false;
	}

	playTrack(idx = null) {
		const video = this.playlist.selectTrack(idx);
		if (video == null) return null;
		this.play(video.video_url);
		return video;
	}

	playNext() {
		const video = this.playlist.selectNext();
		if (video == null) return null;
		this.play(video.video_url);
		return video;
	}

	isPlaying() {
		return this.player.state.status == AudioPlayerStatus.Playing;
	}

	togglePause() {
		if (this.player.state.status === AudioPlayerStatus.Idle) return;
		if (this.player.state.status === AudioPlayerStatus.Paused) this.player.unpause();
		else this.player.pause();
	}

	stop() {
		this.player.stop();
		this.isStopped = true;
		if (this.stream !== null) {
			this.stream.destroy();
			this.stream = null;
		}
	}

	joinVC(chId, gId, adap) {
		if (this.connection !== null) return;
		this.voiceChannelIdleTimer = setTimeout(() => this.destroy(), 5 * 60 * 1000);
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

	createStream(url) {
		this.stream = ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25 });
		return createAudioResource(this.stream, { inputType: StreamType.Arbitrary });
	}

	destroy() {
		this.stop();
		if (this.connection !== null) {
			this.connection.destroy();
			this.connection = null;
		}
	}

	clearPlaylist() {
		this.playlist.clear();
	}

	isEmpty() {
		return this.playlist.isEmpty();
	}

	createEmbed(video) {
		const timeString = toTimeString(video.duration);
		const embed = new MessageEmbed()
			.setTitle(video.title)
			.setAuthor({
				name: video.author_name,
				url: video.author_url,
			})
			.setURL(video.video_url)
			.setThumbnail(video.thumbnail)
			.setTimestamp()
			.addField('Duration', timeString, true);
		return embed;
	}

	showUpcoming() {
		const index = this.playlist.readHead;
		const truncatedTrackList = this.playlist.playlist.slice(index, index + 5);

		const str = truncatedTrackList.reduce((prev, curr, idx) => {
			const title = (curr.title.length < 30) ? curr.title : curr.title.slice(0, 27) + '...';
			const durr = toTimeString(parseInt(curr.duration));
			return prev + `${index + idx}. ${title}\t${durr}\n`;
		}, '');

		if (this.playlist.playlist.length > index + 5) {
			return str + `...${this.playlist.playlist.length - (index + 5)} more`;
		}
		else {
			return str.trim();
		}
	}

	shuffle() {
		const arr = this.playlist.slice(0);
		for (let i = 0; i < arr.length; i++) {
			const r = Math.floor(Math.random() * arr.length);
			const x = arr[r];
			arr[r] = arr[i];
			arr[i] = x;
		}
		this.playlist.playlist = arr;
	}
}

module.exports = MusicPlayer;