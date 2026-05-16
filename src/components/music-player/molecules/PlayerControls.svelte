<script lang="ts">
	import PlayButton from "../atoms/PlayButton.svelte";
	import PrevButton from "../atoms/PrevButton.svelte";
	import NextButton from "../atoms/NextButton.svelte";
	import ModeButton from "../atoms/ModeButton.svelte";
	import type { RepeatMode } from "../types";

	interface Props {
		isPlaying: boolean;
		isLoading: boolean;
		isShuffled: boolean;
		isRepeating: RepeatMode;
		onTogglePlay: () => void;
		onPrev: () => void;
		onNext: () => void;
		onToggleMode: () => void;
	}

	const {
		isPlaying,
		isLoading,
		isShuffled,
		isRepeating,
		onTogglePlay,
		onPrev,
		onNext,
		onToggleMode,
	}: Props = $props();
</script>

<div class="flex items-center justify-center gap-2">
	<ModeButton {isShuffled} {isRepeating} onclick={onToggleMode} />
	<PrevButton onclick={onPrev} />
	<PlayButton {isPlaying} {isLoading} onclick={onTogglePlay} />
	<NextButton onclick={onNext} />
</div>
