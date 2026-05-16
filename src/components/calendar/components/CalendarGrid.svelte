<script lang="ts">
	import type { CalendarGridCell } from "../types";

	interface Props {
		weekDays: string[];
		emptyCellsCount: number;
		cells: CalendarGridCell[];
		onCellClick: (dateKey: string) => void;
		onCellRightClick?: (dateKey: string, event: MouseEvent) => void;
	}

	const { weekDays, emptyCellsCount, cells, onCellClick, onCellRightClick }: Props = $props();

	function getCellClass(cell: CalendarGridCell): string {
		let bgClass =
			"hover:bg-[var(--button-hover-color)] text-[var(--text-color-70)] border border-transparent";

		if (cell.isEmpty) {
			return "aspect-square";
		}

		if (cell.isSelected) {
			bgClass =
				"bg-[var(--link-color)] text-white shadow-md border border-transparent";
		} else if (cell.isToday) {
			bgClass =
				"text-[var(--link-color)] font-bold bg-[var(--link-color)]/10 border border-[var(--link-color)]";
		} else if (cell.hasPost) {
			bgClass =
				"font-bold text-[var(--text-color)] hover:bg-[var(--button-hover-color)] border border-transparent";
		}

		return `calendar-day aspect-square flex items-center justify-center rounded-md cursor-pointer relative transition-all duration-200 ${bgClass}`;
	}

	function handleCellClick(cell: CalendarGridCell) {
		if (!cell.isEmpty && cell.dateKey) {
			onCellClick(cell.dateKey);
		}
	}

	function handleContextMenu(cell: CalendarGridCell, event: MouseEvent) {
		event.preventDefault();
		if (!cell.isEmpty && cell.dateKey && onCellRightClick) {
			onCellRightClick(cell.dateKey, event);
		}
	}
</script>

<div class="grid grid-cols-7 gap-1 mb-2">
	{#each weekDays as day}
		<div
			class="text-center text-xs text-[var(--text-color-70)] font-medium py-1"
		>
			{day}
		</div>
	{/each}
</div>
<div class="grid grid-cols-7 gap-1">
	{#each { length: emptyCellsCount } as _}
		<div class="aspect-square"></div>
	{/each}

	{#each cells as cell (cell.dateKey)}
		{#if !cell.isEmpty}
			<button
				type="button"
				class={getCellClass(cell)}
				data-date={cell.dateKey}
				onclick={() => handleCellClick(cell)}
				oncontextmenu={(e) => handleContextMenu(cell, e)}
			>
				{cell.day}
				{#if (cell.hasPost || cell.hasMemo) && !cell.isSelected}
					<span class="absolute bottom-0.5 flex gap-0.5">
						{#if cell.hasPost}
							<span
								class="w-1 h-1 rounded-full bg-[var(--link-color)]"
							></span>
						{/if}
						{#if cell.hasMemo}
							<span
								class="w-1 h-1 rounded-full bg-amber-500"
							></span>
						{/if}
					</span>
				{/if}
				{#if (cell.hasPost || cell.hasMemo) && (cell.postCount + cell.memoCount) > 1}
					<span
						class="absolute top-0.5 right-0.5 text-[9px] opacity-70 scale-75"
						>{cell.postCount + cell.memoCount}</span
					>
				{/if}
			</button>
		{/if}
	{/each}
</div>
