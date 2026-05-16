<script lang="ts">
	import VolumeButton from "../atoms/VolumeButton.svelte";

	interface Props {
		volume: number;
		isMuted: boolean;
		onToggleMute: () => void;
		onVolumeChange: (event: PointerEvent) => void;
	}

	const { volume, isMuted, onToggleMute, onVolumeChange }: Props = $props();

	const displayVolume = $derived(isMuted ? 0 : volume);
</script>

<div class="flex items-center gap-2">
	<VolumeButton {volume} {isMuted} onclick={onToggleMute} />
	<div
		class="w-20 h-1.5 bg-[var(--button-hover-color)] rounded-full cursor-pointer relative"
		onpointerdown={onVolumeChange}
		role="slider"
		tabindex="0"
		aria-label="音量"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(displayVolume * 100)}
	>
		<div
			class="h-full bg-[var(--link-color)] rounded-full"
			style="width: {displayVolume * 100}%"
		></div>
	</div>
</div>
