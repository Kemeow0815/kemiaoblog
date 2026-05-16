<script lang="ts">
	import type { LyricsData, LyricLine } from "../types";
	import { getCurrentLyricIndex } from "../utils";

	interface Props {
		lyrics: LyricsData;
		currentTime: number;
		isPlaying: boolean;
	}

	const { lyrics, currentTime, isPlaying }: Props = $props();

	let lyricsContainer: HTMLDivElement | undefined = $state(undefined);
	let currentIndex = $derived(getCurrentLyricIndex(lyrics.lines, currentTime));

	// 自动滚动到当前歌词
	$effect(() => {
		if (lyricsContainer && currentIndex >= 0) {
			const currentLine = lyricsContainer.querySelector(`[data-index="${currentIndex}"]`);
			if (currentLine) {
				currentLine.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
			}
		}
	});

	function formatLyricTime(time: number): string {
		const mins = Math.floor(time / 60);
		const secs = Math.floor(time % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}
</script>

<div
	class="lyrics-container bg-[var(--card-bg)] border border-[var(--button-border-color)] rounded-2xl overflow-hidden"
>
	<!-- Header -->
	<div class="px-4 py-3 border-b border-[var(--button-border-color)] flex items-center justify-between">
		<h3 class="font-medium text-[var(--text-color)] flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M9 18V5l12-2v13"></path>
				<circle cx="6" cy="18" r="3"></circle>
				<circle cx="18" cy="16" r="3"></circle>
			</svg>
			歌词
		</h3>
		{#if lyrics.hasLyrics}
			<span class="text-xs text-[var(--text-color-50)]">
				{lyrics.lines.length} 行
			</span>
		{/if}
	</div>

	<!-- Lyrics Content -->
	<div
		bind:this={lyricsContainer}
		class="lyrics-scroll-area p-4 overflow-y-auto"
		class:h-64={lyrics.hasLyrics}
		class:h-auto={!lyrics.hasLyrics}
	>
		{#if lyrics.hasLyrics}
			<div class="space-y-2">
				{#each lyrics.lines as line, index}
					<div
						data-index={index}
						class="lyric-line py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer"
						class:active={index === currentIndex}
						class:text-[var(--text-color)]={index === currentIndex}
						class:font-medium={index === currentIndex}
						class:text-[var(--text-color-70)]={index !== currentIndex}
						class:hover:bg-[var(--button-hover-color)]={index !== currentIndex}
						title={formatLyricTime(line.time)}
					>
						{line.text}
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-12 text-[var(--text-color-50)]">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M9 18V5l12-2v13"></path>
					<circle cx="6" cy="18" r="3"></circle>
					<circle cx="18" cy="16" r="3"></circle>
				</svg>
				<p class="text-sm">暂无歌词</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.lyrics-container {
		/* 使用 CSS 变量适配明暗模式 */
	}

	.lyrics-scroll-area {
		scrollbar-width: thin;
		scrollbar-color: var(--button-hover-color) transparent;
	}

	.lyrics-scroll-area::-webkit-scrollbar {
		width: 4px;
	}

	.lyrics-scroll-area::-webkit-scrollbar-track {
		background: transparent;
	}

	.lyrics-scroll-area::-webkit-scrollbar-thumb {
		background-color: var(--button-hover-color);
		border-radius: 2px;
	}

	.lyric-line {
		font-size: 0.95rem;
		line-height: 1.6;
		text-align: center;
	}

	.lyric-line.active {
		background: linear-gradient(135deg, var(--link-color) 0%, var(--link-hover-color, var(--link-color)) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		transform: scale(1.02);
	}

	/* 移动端适配 */
	@media (max-width: 640px) {
		.lyric-line {
			font-size: 0.875rem;
			padding: 0.375rem 0.5rem;
		}

		.lyrics-scroll-area {
			max-height: 200px;
		}
	}

	/* 平板适配 */
	@media (min-width: 641px) and (max-width: 1024px) {
		.lyrics-scroll-area {
			max-height: 280px;
		}
	}

	/* 桌面端 */
	@media (min-width: 1025px) {
		.lyrics-scroll-area {
			max-height: 320px;
		}
	}
</style>
