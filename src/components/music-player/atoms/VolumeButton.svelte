<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		volume: number;
		isMuted: boolean;
		onclick: () => void;
	}

	const { volume, isMuted, onclick }: Props = $props();

	function getIcon(): string {
		if (isMuted || volume === 0) return "material-symbols:volume-off";
		if (volume < 0.5) return "material-symbols:volume-down";
		return "material-symbols:volume-up";
	}
</script>

<button
	class="p-2 rounded-full hover:bg-[var(--button-hover-color)] text-[var(--text-color-70)] transition-colors"
	aria-label={isMuted ? "取消静音" : "静音"}
	{onclick}
>
	<Icon icon={getIcon()} class="text-xl" />
</button>
