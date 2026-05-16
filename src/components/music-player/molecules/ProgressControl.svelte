<script lang="ts">
	import ProgressBar from "../atoms/ProgressBar.svelte";
	import { formatTime } from "../utils";

	interface Props {
		currentTime: number;
		duration: number;
		onSeek: (event: MouseEvent) => void;
	}

	const { currentTime, duration, onSeek }: Props = $props();
</script>

<div class="flex items-center gap-3 w-full">
	<span class="text-xs text-[var(--text-color-70)] w-10 text-right">
		{formatTime(currentTime)}
	</span>
	<ProgressBar {currentTime} {duration} onclick={onSeek} />
	<span class="text-xs text-[var(--text-color-70)] w-10">
		{formatTime(duration)}
	</span>
</div>
