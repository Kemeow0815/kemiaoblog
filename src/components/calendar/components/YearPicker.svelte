<script lang="ts">
	import { onMount } from "svelte";

	import type { CalendarStats } from "../types";

	interface Props {
		currentYear: number;
		stats: CalendarStats;
		onYearSelect: (year: number) => void;
	}

	const { currentYear, stats, onYearSelect }: Props = $props();

	let containerEl: HTMLDivElement;

	const years = $derived(() => {
		const result: number[] = [];
		for (let y = stats.minYear; y <= stats.maxYear; y++) {
			result.push(y);
		}
		return result;
	});

	function getYearClass(year: number): string {
		const isCurrent = year === currentYear;
		let baseClass =
			"cursor-pointer rounded-lg flex flex-col items-center justify-center py-3 transition-all hover:bg-[var(--button-hover-color)] relative border border-transparent";

		if (isCurrent) {
			baseClass +=
				" border-[var(--link-color)] text-[var(--link-color)] bg-[var(--link-color)]/5";
		} else {
			baseClass += " text-[var(--text-color)]";
		}

		return baseClass;
	}

	function scrollToCurrentYear() {
		setTimeout(() => {
			const el = containerEl?.querySelector(
				`[data-year="${currentYear}"]`,
			);
			if (el) {
				el.scrollIntoView({ block: "center", behavior: "smooth" });
			}
		}, 50);
	}

	onMount(() => {
		scrollToCurrentYear();
	});
</script>

<div
	bind:this={containerEl}
	class="w-full h-full p-2 grid grid-cols-4 gap-2 content-start overflow-y-auto custom-scrollbar"
>
	{#each years() as year (year)}
		{@const hasPost = stats.hasPostInYear[year]}
		<button
			type="button"
			class={getYearClass(year)}
			data-year={year}
			onclick={() => onYearSelect(year)}
		>
			<span class="text-sm font-bold">{year}</span>
			{#if hasPost}
				<span class="w-1.5 h-1.5 rounded-full bg-[var(--link-color)] mt-1"
				></span>
			{:else}
				<span class="w-1.5 h-1.5 mt-1"></span>
			{/if}
		</button>
	{/each}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.5);
		border-radius: 2px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background-color: rgba(156, 163, 175, 0.8);
	}
</style>
