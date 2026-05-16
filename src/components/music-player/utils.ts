export function formatTime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) {
		return "0:00";
	}
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getAssetPath(path: string): string {
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path;
	}
	if (path.startsWith("/")) {
		return path;
	}
	return `/${path}`;
}

export function loadVolumeFromStorage(): number {
	try {
		if (typeof localStorage !== "undefined") {
			const savedVolume = localStorage.getItem("music-player-volume");
			if (savedVolume !== null && !isNaN(parseFloat(savedVolume))) {
				return parseFloat(savedVolume);
			}
		}
	} catch (e) {
		console.warn("Failed to load volume settings:", e);
	}
	return 0.7;
}

export function saveVolumeToStorage(volume: number): void {
	try {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem("music-player-volume", volume.toString());
		}
	} catch (e) {
		console.warn("Failed to save volume settings:", e);
	}
}

/**
 * 解析 LRC 歌词格式
 * 支持格式: [mm:ss.xx] 或 [mm:ss.xxx] 歌词文本
 */
export function parseLRC(lrcContent: string): import("./types").LyricsData {
	const lines: import("./types").LyricLine[] = [];
	
	if (!lrcContent || typeof lrcContent !== "string") {
		return { lines: [], hasLyrics: false };
	}

	const lineRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g;
	let match;

	while ((match = lineRegex.exec(lrcContent)) !== null) {
		const minutes = parseInt(match[1], 10);
		const seconds = parseInt(match[2], 10);
		const milliseconds = parseInt(match[3].padEnd(3, "0"), 10);
		const text = match[4].trim();

		if (text) {
			lines.push({
				time: minutes * 60 + seconds + milliseconds / 1000,
				text
			});
		}
	}

	// 按时间排序
	lines.sort((a, b) => a.time - b.time);

	return {
		lines,
		hasLyrics: lines.length > 0
	};
}

/**
 * 获取当前时间对应的歌词行索引
 */
export function getCurrentLyricIndex(lines: import("./types").LyricLine[], currentTime: number): number {
	if (!lines || lines.length === 0) return -1;

	for (let i = lines.length - 1; i >= 0; i--) {
		if (currentTime >= lines[i].time) {
			return i;
		}
	}
	return -1;
}

/**
 * 加载歌词文件
 */
export async function loadLyrics(lrcUrl: string): Promise<import("./types").LyricsData> {
	try {
		const response = await fetch(lrcUrl);
		if (!response.ok) {
			throw new Error(`Failed to load lyrics: ${response.status}`);
		}
		const content = await response.text();
		return parseLRC(content);
	} catch (error) {
		console.warn("Failed to load lyrics:", error);
		return { lines: [], hasLyrics: false };
	}
}

/**
 * 通过 Meting API 获取歌曲详情（包括最新的音频 URL）
 * 使用 type=song 接口，比直接使用 url 字段更可靠
 */
export async function fetchSongUrl(
	metingApi: string,
	server: string,
	songId: number | string
): Promise<{ url: string; lrc?: string; pic?: string } | null> {
	try {
		const baseUrl = metingApi.replace(/\/$/, "");
		const apiUrl = `${baseUrl}/api?server=${server}&type=song&id=${encodeURIComponent(songId.toString())}`;

		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const data = await response.json();
		if (!Array.isArray(data) || data.length === 0) {
			return null;
		}

		const song = data[0];
		return {
			url: song.url || "",
			lrc: song.lrc || undefined,
			pic: song.pic || undefined
		};
	} catch (error) {
		console.warn("Failed to fetch song URL:", error);
		return null;
	}
}
