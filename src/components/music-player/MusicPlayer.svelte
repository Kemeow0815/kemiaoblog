<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import Icon from "@iconify/svelte";
	import type { Song, RepeatMode, LyricsData } from "./types";
	import { DEFAULT_SONG, DEFAULT_PLAYLIST, DEFAULT_METING_API } from "./constants";
	import { formatTime, loadVolumeFromStorage, saveVolumeToStorage, getAssetPath, loadLyrics, fetchSongUrl } from "./utils";
	import PlayerControls from "./molecules/PlayerControls.svelte";
	import TrackDisplay from "./molecules/TrackDisplay.svelte";
	import ProgressControl from "./molecules/ProgressControl.svelte";
	import VolumeControl from "./molecules/VolumeControl.svelte";
	import PlaylistItem from "./atoms/PlaylistItem.svelte";
	import CoverImage from "./atoms/CoverImage.svelte";
	import LyricsDisplay from "./molecules/LyricsDisplay.svelte";

	// Props
	interface Props {
		playlist?: Song[];
		mode?: "local" | "meting";
		metingApi?: string;
		metingServer?: string;
		metingType?: string;
		metingId?: string;
	}

	let { 
		playlist: initialPlaylist = DEFAULT_PLAYLIST,
		mode = "local",
		metingApi = DEFAULT_METING_API,
		metingServer = "netease",
		metingType = "playlist",
		metingId = ""
	}: Props = $props();

	// State
	let audio: HTMLAudioElement | undefined = $state(undefined);
	let isPlaying = $state(false);
	let isLoading = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let volume = $state(0.7);
	let isMuted = $state(false);
	let isShuffled = $state(false);
	let isRepeating: RepeatMode = $state(0);
	let currentIndex = $state(0);
	let playlist: Song[] = $state([]);
	let currentSong: Song = $state(DEFAULT_SONG);
	let showPlaylist = $state(false);
	let showLyrics = $state(false);
	let errorMessage = $state("");
	let showError = $state(false);
	let autoplayFailed = $state(false);
	let currentLyrics: LyricsData = $state({ lines: [], hasLyrics: false });
	let isLoadingLyrics = $state(false);

	// Derived state
	const hasPrev = $derived(playlist.length > 1);
	const hasNext = $derived(playlist.length > 1);

	// Initialize
	onMount(() => {
		volume = loadVolumeFromStorage();
		if (mode === "meting" && metingId) {
			loadMetingPlaylist();
		} else {
			playlist = [...initialPlaylist];
			if (playlist.length > 0) {
				currentSong = playlist[0];
				loadCurrentLyrics();
			}
		}
	});

	onDestroy(() => {
		if (audio) {
			audio.pause();
			audio.src = "";
		}
	});

	// Load Meting playlist
	async function loadMetingPlaylist() {
		isLoading = true;
		try {
			// 构建 API URL
			// 格式: /api?server=:server&type=:type&id=:id
			const baseUrl = metingApi.replace(/\/$/, "");
			const apiUrl = `${baseUrl}/api?server=${metingServer}&type=${metingType}&id=${encodeURIComponent(metingId)}`;

			console.log("Loading Meting playlist:", apiUrl);

			const res = await fetch(apiUrl);
			if (!res.ok) {
				const errorHeader = res.headers.get("x-error-message");
				throw new Error(errorHeader || `HTTP ${res.status}`);
			}
			
			const data = await res.json();
			console.log("Meting API response:", data);
			
			if (!Array.isArray(data) || data.length === 0) {
				throw new Error("播放列表为空");
			}
			
			// 处理 Meting API 返回格式
			playlist = data.map((item: any, index: number) => ({
				id: item.id || index,
				title: item.title || item.name || "未知歌曲",
				artist: item.author || item.artist || "未知艺术家",
				cover: item.pic || "/favicon/favicon.ico",
				url: item.url || "",
				duration: item.duration || 0,
				lrc: item.lrc || undefined
			}));

			if (playlist.length > 0) {
				currentSong = playlist[0];
				loadCurrentLyrics();
			}
		} catch (e: any) {
			console.error("Failed to load Meting playlist:", e);
			showErrorMessage(`加载播放列表失败: ${e.message}`);
			playlist = [...initialPlaylist];
			if (playlist.length > 0) {
				currentSong = playlist[0];
			}
		} finally {
			isLoading = false;
		}
	}

	// Audio event handlers
	function initAudio() {
		if (!audio) return;

		audio.addEventListener("loadedmetadata", () => {
			duration = audio?.duration || 0;
			if (duration > 0) {
				const roundedDuration = Math.floor(duration);
				// 更新当前歌曲的时长
				currentSong = { ...currentSong, duration: roundedDuration };
				// 同步更新播放列表中对应歌曲的时长
				playlist = playlist.map((song, idx) =>
					idx === currentIndex ? { ...song, duration: roundedDuration } : song
				);
			}
		});

		audio.addEventListener("timeupdate", () => {
			currentTime = audio?.currentTime || 0;
		});

		audio.addEventListener("ended", () => {
			next();
		});

		audio.addEventListener("error", async (e) => {
			isLoading = false;
			isPlaying = false;
			console.error("Audio error:", e);

			// 检查是否是 Meting API 的 URL 问题
			const audioSrc = audio?.src || "";
			const isMetingUrl = audioSrc.includes("meting") || currentSong.url?.includes("meting");

			if (isMetingUrl) {
				// 尝试重新获取音频 URL（可能是 URL 过期了）
				if (mode === "meting" && currentSong.id) {
					showErrorMessage(`「${currentSong.title}」音频链接失效，尝试重新获取...`);
					const newUrl = await resolveAudioUrl(currentSong);
					if (newUrl && newUrl !== audioSrc) {
						// 获取到了新的 URL，尝试重新播放
						audio.src = getAssetPath(newUrl);
						audio.play().then(() => {
							isPlaying = true;
						}).catch(() => {
							// 新 URL 也失败，跳过这首歌
							skipToNext();
						});
						return;
					}
				}
				// 自动跳过无法播放的歌曲
				skipToNext();
			} else {
				showErrorMessage("音频加载失败，请检查网络连接");
			}
		});

		audio.addEventListener("canplay", () => {
			isLoading = false;
		});
	}

	// Controls
	async function togglePlay() {
		if (!audio) {
			// Create audio element on first play
			audio = new Audio();
			audio.volume = volume;
			audio.muted = isMuted;
			initAudio();
		}

		// 检查是否需要重新加载音频（首次播放或切换歌曲）
		const needsReload = !audio.src || audio.src === "";

		if (needsReload) {
			isLoading = true;
			const audioUrl = await resolveAudioUrl(currentSong);
			if (audioUrl) {
				audio.src = getAssetPath(audioUrl);
			} else {
				isLoading = false;
				showErrorMessage("暂无可用音频");
				return;
			}
		}

		if (isPlaying) {
			audio.pause();
			isPlaying = false;
		} else {
			isLoading = true;
			audio.play().then(() => {
				isPlaying = true;
				autoplayFailed = false;
			}).catch(() => {
				autoplayFailed = true;
				isPlaying = false;
				isLoading = false;
			});
		}
	}

	function prev() {
		if (playlist.length <= 1) return;
		
		let newIndex: number;
		if (isShuffled) {
			do {
				newIndex = Math.floor(Math.random() * playlist.length);
			} while (newIndex === currentIndex && playlist.length > 1);
		} else {
			newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
		}
		
		playIndex(newIndex);
	}

	function skipToNext() {
		// 自动跳过无法播放的歌曲
		if (playlist.length > 1) {
			showErrorMessage(`「${currentSong.title}」无法播放，自动切换下一首`);
			setTimeout(() => {
				next();
			}, 1500);
		} else {
			showErrorMessage("该歌曲无法播放，可能是版权限制或 API 需要登录");
		}
	}

	function next() {
		if (playlist.length <= 1) return;

		if (isRepeating === 1) {
			// Single repeat - replay current
			if (audio) {
				audio.currentTime = 0;
				audio.play().catch(() => {});
			}
			return;
		}

		let newIndex: number;
		if (isShuffled) {
			do {
				newIndex = Math.floor(Math.random() * playlist.length);
			} while (newIndex === currentIndex && playlist.length > 1);
		} else {
			newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
		}
		
		playIndex(newIndex);
	}

	async function loadCurrentLyrics() {
		if (currentSong.lrc) {
			isLoadingLyrics = true;
			try {
				currentLyrics = await loadLyrics(currentSong.lrc);
			} catch (e) {
				console.warn("Failed to load lyrics:", e);
				currentLyrics = { lines: [], hasLyrics: false };
			} finally {
				isLoadingLyrics = false;
			}
		} else {
			currentLyrics = { lines: [], hasLyrics: false };
		}
	}

	async function resolveAudioUrl(song: Song): Promise<string | null> {
		// 如果是 Meting 模式，尝试通过 type=song 接口获取最新 URL
		if (mode === "meting" && metingApi && song.id) {
			const songData = await fetchSongUrl(metingApi, metingServer, song.id);
			if (songData?.url) {
				// 更新歌曲信息（包括歌词和封面）
				if (songData.lrc && !song.lrc) {
					song.lrc = songData.lrc;
				}
				if (songData.pic && song.cover === "/favicon/favicon.ico") {
					song.cover = songData.pic;
				}
				return songData.url;
			}
		}
		// 回退到使用原有的 url 字段
		return song.url || null;
	}

	async function playIndex(index: number) {
		if (index < 0 || index >= playlist.length) return;

		currentIndex = index;
		currentSong = playlist[index];
		currentTime = 0;

		// 加载歌词
		loadCurrentLyrics();

		if (audio) {
			isLoading = true;
			// 动态获取音频 URL
			const audioUrl = await resolveAudioUrl(currentSong);
			if (audioUrl) {
				audio.src = getAssetPath(audioUrl);
				audio.play().then(() => {
					isPlaying = true;
				}).catch(() => {
					isPlaying = false;
				});
			} else {
				isLoading = false;
				showErrorMessage(`「${currentSong.title}」无法获取音频链接`);
				// 自动尝试下一首
				if (playlist.length > 1) {
					setTimeout(() => next(), 1500);
				}
			}
		}
	}

	function toggleMode() {
		if (isShuffled) {
			isShuffled = false;
			isRepeating = 1;
		} else if (isRepeating === 1) {
			isRepeating = 0;
		} else {
			isShuffled = true;
			isRepeating = 0;
		}
	}

	function seek(event: MouseEvent) {
		if (!audio || !duration) return;
		
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const percent = (event.clientX - rect.left) / rect.width;
		const newTime = Math.max(0, Math.min(duration, percent * duration));
		
		audio.currentTime = newTime;
		currentTime = newTime;
	}

	function toggleMute() {
		isMuted = !isMuted;
		if (audio) {
			audio.muted = isMuted;
		}
	}

	function handleVolumeChange(event: PointerEvent) {
		const slider = event.currentTarget as HTMLElement;
		const rect = slider.getBoundingClientRect();
		const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
		
		volume = percent;
		if (audio) {
			audio.volume = percent;
		}
		if (percent > 0 && isMuted) {
			isMuted = false;
			audio && (audio.muted = false);
		}
		saveVolumeToStorage(volume);
	}

	function showErrorMessage(message: string) {
		errorMessage = message;
		showError = true;
		setTimeout(() => {
			showError = false;
		}, 3000);
	}

	function togglePlaylist() {
		showPlaylist = !showPlaylist;
		if (showPlaylist) showLyrics = false;
	}

	function toggleLyrics() {
		showLyrics = !showLyrics;
		if (showLyrics) showPlaylist = false;
	}
</script>

<div class="w-full max-w-4xl mx-auto">
	<!-- Main Player Card -->
	<div class="bg-[var(--card-bg)] border border-[var(--button-border-color)] rounded-2xl p-6 shadow-lg">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-lg font-bold text-[var(--text-color)]">音乐播放器</h2>
			<div class="flex items-center gap-2">
				<button
					class="p-2 rounded-full hover:bg-[var(--button-hover-color)] text-[var(--text-color-70)] transition-colors"
					class:text-[var(--link-color)]={showLyrics}
					onclick={toggleLyrics}
					aria-label="歌词"
					title="歌词"
				>
					<Icon icon="material-symbols:lyrics" class="text-xl" />
				</button>
				<button
					class="p-2 rounded-full hover:bg-[var(--button-hover-color)] text-[var(--text-color-70)] transition-colors"
					class:text-[var(--link-color)]={showPlaylist}
					onclick={togglePlaylist}
					aria-label="播放列表"
					title="播放列表"
				>
					<Icon icon="material-symbols:playlist-play" class="text-2xl" />
				</button>
			</div>
		</div>

		<!-- Track Info & Cover -->
		<div class="flex flex-col md:flex-row items-center gap-6 mb-6">
			<CoverImage src={currentSong.cover} alt={currentSong.title} size="lg" isPlaying={isPlaying} />
			<div class="text-center md:text-left flex-1 min-w-0">
				<h3 class="text-xl font-bold text-[var(--text-color)] truncate mb-1">
					{currentSong.title}
				</h3>
				<p class="text-[var(--text-color-70)] truncate">
					{currentSong.artist}
				</p>
				<div class="mt-4 flex items-center justify-center md:justify-start gap-4 text-sm text-[var(--text-color-70)]">
					<span>{formatTime(currentTime)}</span>
					<span>/</span>
					<span>{formatTime(duration || currentSong.duration)}</span>
				</div>
			</div>
		</div>

		<!-- Progress Bar -->
		<div class="mb-6">
			<ProgressControl {currentTime} duration={duration || currentSong.duration} onSeek={seek} />
		</div>

		<!-- Controls -->
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
			<PlayerControls
				{isPlaying}
				{isLoading}
				{isShuffled}
				{isRepeating}
				onTogglePlay={togglePlay}
				onPrev={prev}
				onNext={next}
				onToggleMode={toggleMode}
			/>
			<VolumeControl {volume} {isMuted} onToggleMute={toggleMute} onVolumeChange={handleVolumeChange} />
		</div>

		<!-- Error Message -->
		{#if showError}
			<div class="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
				{errorMessage}
			</div>
		{/if}
	</div>

	<!-- Lyrics Panel -->
	{#if showLyrics}
		<div class="mt-4">
			<LyricsDisplay lyrics={currentLyrics} {currentTime} {isPlaying} />
		</div>
	{/if}

	<!-- Playlist Panel -->
	{#if showPlaylist}
		<div class="mt-4 bg-[var(--card-bg)] border border-[var(--button-border-color)] rounded-2xl overflow-hidden shadow-lg">
			<div class="px-4 py-3 border-b border-[var(--button-border-color)] flex items-center justify-between">
				<h3 class="font-medium text-[var(--text-color)]">播放列表 ({playlist.length})</h3>
				<button
					class="p-1.5 rounded-lg hover:bg-[var(--button-hover-color)] text-[var(--text-color-70)] transition-colors"
					onclick={() => showPlaylist = false}
				>
					<Icon icon="material-symbols:close" class="text-lg" />
				</button>
			</div>
			<div class="max-h-80 overflow-y-auto">
				{#if playlist.length > 0}
					{#each playlist as song, index}
						<PlaylistItem
							{song}
							isActive={index === currentIndex}
							{index}
							onclick={() => playIndex(index)}
						/>
					{/each}
				{:else}
					<div class="px-4 py-8 text-center text-[var(--text-color-70)]">
						播放列表为空
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
