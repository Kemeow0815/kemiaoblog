<script lang="ts">
	import Icon from "@iconify/svelte";
	import type { Song } from "../types";
	import { formatTime } from "../utils";

	interface Props {
		song: Song;
		isActive: boolean;
		index: number;
		onclick: () => void;
	}

	const { song, isActive, index, onclick }: Props = $props();
</script>

<button
	class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
	class:bg-[var(--link-color)]={isActive}
	class:text-white={isActive}
	class:hover:bg-[var(--button-hover-color)]={!isActive}
	{onclick}
>
	<span 
		class="text-sm w-6 text-center"
		class:text-white={isActive}
		class:text-[var(--text-color-70)]={!isActive}
	>
		{#if isActive}
			<Icon icon="material-symbols:volume-up" class="text-white" />
		{:else}
			{index + 1}
		{/if}
	</span>
	<div class="flex-1 min-w-0">
		<div 
			class="text-sm font-medium truncate"
			class:text-white={isActive}
			class:text-[var(--text-color)]={!isActive}
		>
			{song.title}
		</div>
		<div 
			class="text-xs truncate"
			class:text-white={isActive}
			class:text-opacity-80={isActive}
			class:text-[var(--text-color-70)]={!isActive}
		>
			{song.artist}
		</div>
	</div>
	<span 
		class="text-xs"
		class:text-white={isActive}
		class:text-opacity-80={isActive}
		class:text-[var(--text-color-70)]={!isActive}
	>
		{formatTime(song.duration)}
	</span>
</button>
