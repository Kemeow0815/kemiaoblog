export interface Song {
	id: number;
	title: string;
	artist: string;
	cover: string;
	url: string;
	duration: number;
	lrc?: string; // 歌词文件 URL
}

export interface LyricLine {
	time: number; // 时间（秒）
	text: string; // 歌词文本
}

export interface LyricsData {
	lines: LyricLine[];
	hasLyrics: boolean;
}

export type PlayerMode = "local" | "meting";

export type RepeatMode = 0 | 1 | 2; // 0: 列表循环, 1: 单曲循环, 2: 随机播放

export interface PlayerState {
	isPlaying: boolean;
	isExpanded: boolean;
	isHidden: boolean;
	showPlaylist: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	isLoading: boolean;
	isShuffled: boolean;
	isRepeating: RepeatMode;
	errorMessage: string;
	showError: boolean;
	currentSong: Song;
	playlist: Song[];
	currentIndex: number;
	autoplayFailed: boolean;
	willAutoPlay: boolean;
}

export interface MusicPlayerConfig {
	enable: boolean;
	mode: PlayerMode;
	showFloatingPlayer: boolean;
	floatingEntryMode?: "default" | "fab";
	// Local mode config
	playlist?: Song[];
	// Meting mode config
	metingApi?: string;
	metingServer?: string;
	metingType?: string;
	metingId?: string;
}
