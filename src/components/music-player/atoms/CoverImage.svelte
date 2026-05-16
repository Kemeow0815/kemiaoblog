<script lang="ts">
	import { getAssetPath } from "../utils";

	interface Props {
		src: string;
		alt: string;
		size?: "sm" | "md" | "lg";
		isPlaying?: boolean;
	}

	const { src, alt, size = "md", isPlaying = false }: Props = $props();

	const sizeClasses = {
		sm: "w-10 h-10",
		md: "w-14 h-14",
		lg: "w-20 h-20",
	};
</script>

<div class="relative {sizeClasses[size]} rounded-lg overflow-hidden bg-[var(--button-hover-color)] flex-shrink-0">
	<img
		src={getAssetPath(src)}
		{alt}
		class="w-full h-full object-cover"
		class:animate-pulse={isPlaying}
	/>
	{#if isPlaying}
		<div class="absolute inset-0 flex items-center justify-center bg-black/20">
			<div class="flex gap-0.5 items-end h-4">
				<div class="w-1 bg-white rounded-full animate-[bounce_1s_infinite]"></div>
				<div class="w-1 bg-white rounded-full animate-[bounce_1s_infinite_0.1s]"></div>
				<div class="w-1 bg-white rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
			</div>
		</div>
	{/if}
</div>
