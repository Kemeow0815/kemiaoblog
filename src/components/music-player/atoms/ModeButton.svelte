<script lang="ts">
	import Icon from "@iconify/svelte";
	import type { RepeatMode } from "../types";

	interface Props {
		isShuffled: boolean;
		isRepeating: RepeatMode;
		onclick: () => void;
	}

	const { isShuffled, isRepeating, onclick }: Props = $props();

	function getIcon(): string {
		if (isShuffled) return "material-symbols:shuffle";
		if (isRepeating === 1) return "material-symbols:repeat-one";
		return "material-symbols:repeat";
	}

	function getLabel(): string {
		if (isShuffled) return "随机播放";
		if (isRepeating === 1) return "单曲循环";
		if (isRepeating === 2) return "列表循环";
		return "顺序播放";
	}
</script>

<button
	class="p-2 rounded-full hover:bg-[var(--button-hover-color)] transition-colors"
	class:text-[var(--link-color)]={isShuffled || isRepeating !== 0}
	class:text-[var(--text-color-70)]={!isShuffled && isRepeating === 0}
	aria-label={getLabel()}
	{onclick}
>
	<Icon icon={getIcon()} class="text-xl" />
</button>
