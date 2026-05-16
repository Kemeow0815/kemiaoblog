<script lang="ts">
	import CoverImage from "../atoms/CoverImage.svelte";
	import type { Song } from "../types";

	interface Props {
		song: Song;
		isPlaying: boolean;
	}

	const { song, isPlaying }: Props = $props();
</script>

<div class="flex items-center gap-3">
	<CoverImage src={song.cover} alt={song.title} size="md" {isPlaying} />
	<div class="min-w-0">
		<div class="text-sm font-medium text-[var(--text-color)] truncate">
			{song.title}
		</div>
		<div class="text-xs text-[var(--text-color-70)] truncate">
			{song.artist}
		</div>
	</div>
</div>
