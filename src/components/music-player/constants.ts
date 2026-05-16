import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const DEFAULT_SONG: Song = {
	title: "未知歌曲",
	artist: "未知艺术家",
	cover: "/favicon/favicon.ico",
	url: "",
	duration: 0,
	id: 0,
};

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;

// 示例播放列表 - 用户可以替换为自己的音乐
export const DEFAULT_PLAYLIST: Song[] = [
	{
		id: 1,
		title: "示例歌曲 1",
		artist: "示例艺术家",
		cover: "/favicon/favicon.ico",
		url: "",
		duration: 180,
	},
];

// Meting API 默认配置
export const DEFAULT_METING_API =
	"https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r";
