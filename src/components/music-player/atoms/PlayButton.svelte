<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		isPlaying: boolean;
		isLoading: boolean;
		onclick: () => void;
	}

	const { isPlaying, isLoading, onclick }: Props = $props();
</script>

<button
	class="w-12 h-12 rounded-full bg-[var(--link-color)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
	class:opacity-50={isLoading}
	disabled={isLoading}
	aria-label={isPlaying ? "暂停" : "播放"}
	{onclick}
>
	{#if isLoading}
		<Icon icon="eos-icons:loading" class="text-xl" />
	{:else if isPlaying}
		<Icon icon="material-symbols:pause" class="text-xl" />
	{:else}
		<Icon icon="material-symbols:play-arrow" class="text-xl" />
	{/if}
</button>
