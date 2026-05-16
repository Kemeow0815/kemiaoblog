<script lang="ts">
	interface Props {
		currentTime: number;
		duration: number;
		onclick: (event: MouseEvent) => void;
	}

	const { currentTime, duration, onclick }: Props = $props();

	const progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
</script>

<div
	class="flex-1 h-2 bg-[var(--button-hover-color)] rounded-full cursor-pointer relative overflow-hidden"
	{onclick}
	role="slider"
	tabindex="0"
	aria-label="进度条"
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={progress}
>
	<div
		class="h-full bg-[var(--link-color)] rounded-full transition-all duration-100"
		style="width: {progress}%"
	></div>
</div>
