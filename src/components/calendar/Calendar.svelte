<script lang="ts">
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";

	let dateCheckInterval: ReturnType<typeof setInterval> | null = null;

	function updateTodayDate() {
		const now = new Date();
		todayYear = now.getFullYear();
		todayMonth = now.getMonth();
		todayDate = now.getDate();
	}

	import { CalendarGrid, MemoEditor, MonthPicker, YearPicker } from "./components";
	import {
		buildMemoDateMap,
		createMemo,
		deleteMemo,
		formatDateKey,
		formatMonthKey,
		getCurrentPostId,
		getDaysInMonth,
		getFirstDayOfMonth,
		loadMemosFromStorage,
		processPostsData,
		saveMemosToStorage,
		updateMemo,
	} from "./hooks/useCalendar";
	import type {
		CalendarGridCell,
		CalendarMemo,
		CalendarPost,
		CalendarStats,
	} from "./types";

	interface Props {
		monthNames: string[];
		weekDays: string[];
		yearSuffix: string;
		currentLang: string;
	}

	const { monthNames, weekDays, yearSuffix, currentLang }: Props = $props();

	// State
	let allPostsData: CalendarPost[] = $state([]);
	let postDateMap: Record<string, CalendarPost[]> = $state({});
	let postsByMonth: Record<string, CalendarPost[]> = $state({});
	let stats: CalendarStats = $state({
		hasPostInYear: {},
		hasPostInMonth: {},
		minYear: new Date().getFullYear(),
		maxYear: new Date().getFullYear() + 5,
	});

	// Memo state
	let allMemos: CalendarMemo[] = $state([]);
	let memoDateMap: Record<string, CalendarMemo[]> = $state({});

	let currentYear = $state(new Date().getFullYear());
	let currentMonth = $state(new Date().getMonth());
	let selectedDateKey: string | null = $state(null);
	let currentView: "day" | "month" | "year" = $state("day");

	// Memo editor state
	let isMemoEditorOpen = $state(false);
	let editingDateKey: string | null = $state(null);

	// Today's date (reactive, updates at midnight)
	let todayYear = $state(new Date().getFullYear());
	let todayMonth = $state(new Date().getMonth());
	let todayDate = $state(new Date().getDate());

	const isBackToTodayVisible = $derived(
		currentYear !== todayYear ||
			currentMonth !== todayMonth ||
			selectedDateKey !== null,
	);

	const emptyCellsCount = $derived(
		getFirstDayOfMonth(currentYear, currentMonth),
	);

	const cells = $derived(
		(() => {
			const daysInMonth = getDaysInMonth(currentYear, currentMonth);
			const result: CalendarGridCell[] = [];

			for (let day = 1; day <= daysInMonth; day++) {
				const dateKey = formatDateKey(currentYear, currentMonth, day);
				const posts = postDateMap[dateKey] || [];
				const memos = memoDateMap[dateKey] || [];
				const isToday =
					currentYear === todayYear &&
					currentMonth === todayMonth &&
					day === todayDate;
				const isSelected = selectedDateKey === dateKey;

				result.push({
					day,
					dateKey,
					posts,
					memos,
					hasPost: posts.length > 0,
					hasMemo: memos.length > 0,
					postCount: posts.length,
					memoCount: memos.length,
					isToday,
					isSelected,
					isEmpty: false,
				});
			}

			return result;
		})(),
	);

	const currentPostId = $derived(
		getCurrentPostId(window.location.pathname, allPostsData),
	);

	const displayedPosts = $derived(
		(() => {
			if (selectedDateKey && postDateMap[selectedDateKey]) {
				return postDateMap[selectedDateKey];
			}
			const monthKey = formatMonthKey(currentYear, currentMonth);
			return postsByMonth[monthKey] || [];
		})(),
	);

	const displayedMemos = $derived(
		editingDateKey ? memoDateMap[editingDateKey] || [] : [],
	);

	// Functions
	async function fetchCalendarData() {
		try {
			const res = await fetch("/api/calendar-data.json");
			const data = await res.json();
			if (Array.isArray(data)) {
				allPostsData = data;
				const processed = processPostsData(allPostsData);
				postDateMap = processed.postDateMap;
				postsByMonth = processed.postsByMonth;
				stats = processed.stats;

				const currentPostIdValue = getCurrentPostId(
					window.location.pathname,
					allPostsData,
				);
				if (currentPostIdValue) {
					const matchedPost = allPostsData.find(
						(p) => p.id === currentPostIdValue,
					);
					if (matchedPost) {
						const [y, m] = matchedPost.date.split("-");
						currentYear = parseInt(y);
						currentMonth = parseInt(m) - 1;
					}
				}
			}
		} catch (error) {
			console.error("Failed to fetch calendar data:", error);
		}
	}

	function handlePrevMonth() {
		currentMonth--;
		if (currentMonth < 0) {
			currentMonth = 11;
			currentYear--;
		}
	}

	function handleNextMonth() {
		currentMonth++;
		if (currentMonth > 11) {
			currentMonth = 0;
			currentYear++;
		}
	}

	function handleBackToToday() {
		currentYear = todayYear;
		currentMonth = todayMonth;
		selectedDateKey = null;
		if (currentView !== "day") {
			closeSelectionPanel();
		}
	}

	function handleTitleClick() {
		if (currentView === "day") {
			showMonthPicker();
		} else if (currentView === "month") {
			showYearPicker();
		} else {
			closeSelectionPanel();
		}
	}

	function handleCellClick(dateKey: string) {
		openMemoEditor(dateKey);
	}

	function handleMonthSelect(month: number) {
		currentMonth = month;
		closeSelectionPanel();
	}

	function handleYearSelect(year: number) {
		currentYear = year;
		showMonthPicker();
	}

	function showMonthPicker() {
		currentView = "month";
	}

	function showYearPicker() {
		currentView = "year";
	}

	function closeSelectionPanel() {
		currentView = "day";
	}

	// Memo functions
	function loadMemos() {
		allMemos = loadMemosFromStorage();
		memoDateMap = buildMemoDateMap(allMemos);
	}

	function handleSaveMemo(content: string) {
		if (!editingDateKey) return;
		const newMemo = createMemo(content, editingDateKey);
		allMemos = [...allMemos, newMemo];
		memoDateMap = buildMemoDateMap(allMemos);
		saveMemosToStorage(allMemos);
	}

	function handleUpdateMemo(memoId: string, content: string) {
		allMemos = updateMemo(allMemos, memoId, content);
		memoDateMap = buildMemoDateMap(allMemos);
		saveMemosToStorage(allMemos);
	}

	function handleDeleteMemo(memoId: string) {
		allMemos = deleteMemo(allMemos, memoId);
		memoDateMap = buildMemoDateMap(allMemos);
		saveMemosToStorage(allMemos);
	}

	function openMemoEditor(dateKey: string) {
		editingDateKey = dateKey;
		isMemoEditorOpen = true;
	}

	function closeMemoEditor() {
		isMemoEditorOpen = false;
		editingDateKey = null;
	}

	function handleCellRightClick(dateKey: string, _event: MouseEvent) {
		openMemoEditor(dateKey);
	}

	onMount(() => {
		fetchCalendarData();
		loadMemos();

		// Check for date change every minute
		dateCheckInterval = setInterval(() => {
			const now = new Date();
			if (
				now.getFullYear() !== todayYear ||
				now.getMonth() !== todayMonth ||
				now.getDate() !== todayDate
			) {
				updateTodayDate();
			}
		}, 60000);

		return () => {
			if (dateCheckInterval) {
				clearInterval(dateCheckInterval);
			}
		};
	});
</script>

<div class="flex justify-between items-center mb-2 mt-2">
	<div
		class="font-bold transition text-lg text-[var(--text-color)] relative ml-4 flex items-center
			before:w-1 before:h-4 before:rounded-md before:bg-[var(--link-color)]
			before:absolute before:left-[-16px] before:top-[13.5px]"
	>
		<button
			type="button"
			class="flex justify-center items-center cursor-pointer hover:bg-[var(--button-hover-color)] px-2 py-2 -ml-2 rounded-lg transition-colors"
			onclick={handleTitleClick}
			aria-label="Select month or year"
		>
			<span
				class="text-lg font-bold text-[var(--text-color)] select-none"
			>
				{currentYear}{yearSuffix}
				{monthNames[currentMonth]}
			</span>
		</button>
	</div>

	<div class="flex items-center gap-1 shrink-0 ml-2">
		{#if isBackToTodayVisible}
			<button
				type="button"
				class="p-1.5 rounded-md hover:bg-[var(--button-hover-color)] text-[var(--link-color)] transition-all"
				onclick={handleBackToToday}
				aria-label="Back to today"
			>
				<Icon
					icon="material-symbols:restart-alt-rounded"
					class="text-xl"
				/>
			</button>
		{/if}
		<button
			type="button"
			class="p-1.5 rounded-md hover:bg-[var(--button-hover-color)] text-[var(--text-color-70)] hover:text-[var(--link-color)] transition-colors {currentView ===
			'day'
				? ''
				: 'invisible'}"
			onclick={handlePrevMonth}
			aria-label="Previous month"
		>
			<Icon icon="material-symbols:arrow-back-ios-new" class="text-lg" />
		</button>
		<button
			type="button"
			class="p-1.5 rounded-md hover:bg-[var(--button-hover-color)] text-[var(--text-color-70)] hover:text-[var(--link-color)] transition-colors {currentView ===
			'day'
				? ''
				: 'invisible'}"
			onclick={handleNextMonth}
			aria-label="Next month"
		>
			<Icon
				icon="material-symbols:arrow-back-ios-new"
				class="text-lg rotate-180"
			/>
		</button>
	</div>
</div>

<div class="relative w-full overflow-hidden" style="min-height: 15.625rem;">
	<div id="calendar-view" class="w-full opacity-100">
		<CalendarGrid
			{weekDays}
			{emptyCellsCount}
			{cells}
			onCellClick={handleCellClick}
			onCellRightClick={handleCellRightClick}
		/>

		<div class="mt-4">
			<div
				class="h-[1px] w-full bg-[var(--button-border-color)] mb-2"
				class:hidden={displayedPosts.length === 0}
			></div>
			<div
				class="flex flex-col gap-1 max-h-[9.375rem] overflow-y-auto custom-scrollbar"
			>
				{#if displayedPosts.length > 0}
					{#each displayedPosts as post (post.id)}
						{@const isCurrentPost = post.id === currentPostId}
						{@const [, m, d] = post.date.split("-")}
						{@const dateStr = `${parseInt(m)}-${parseInt(d)}`}
						<a
							href="/{currentLang === 'zh-cn' ? '' : currentLang + '/'}blog/{post.id}/"
							class="flex items-center justify-between text-sm transition-colors px-2 py-2 rounded-lg group border border-transparent
								{isCurrentPost
								? 'bg-[var(--link-color)]/10 text-[var(--link-color)] border-[var(--link-color)]/10'
								: 'text-[var(--text-color)] hover:text-[var(--link-color)] hover:bg-[var(--button-hover-color)]'}"
						>
							<span
								class="truncate flex-1 font-bold transition-colors"
								>{post.title}</span
							>
							<span
								class="text-xs ml-2 whitespace-nowrap transition-colors
								{isCurrentPost
									? 'text-[var(--link-color)]/80'
									: 'text-[var(--text-color-70)] group-hover:text-[var(--link-color)]/70'}"
							>
								{dateStr}
							</span>
						</a>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	{#if currentView === "month"}
		<div class="absolute inset-0 bg-[var(--bg-color)] z-10 flex flex-col">
			<MonthPicker
				{monthNames}
				{currentYear}
				{currentMonth}
				{stats}
				onMonthSelect={handleMonthSelect}
			/>
		</div>
	{:else if currentView === "year"}
		<div class="absolute inset-0 bg-[var(--bg-color)] z-10 flex flex-col">
			<YearPicker {currentYear} {stats} onYearSelect={handleYearSelect} />
	</div>
{/if}
</div>

<!-- Memo Editor Modal -->
<MemoEditor
	isOpen={isMemoEditorOpen}
	dateKey={editingDateKey || ""}
	memos={displayedMemos}
	onClose={closeMemoEditor}
	onSave={handleSaveMemo}
	onDelete={handleDeleteMemo}
	onUpdate={handleUpdateMemo}
/>

<!-- Memo Hint -->
<div class="mt-3 flex items-center justify-center gap-4 text-xs text-[var(--text-color-70)]">
	<div class="flex items-center gap-1">
		<span class="w-1.5 h-1.5 rounded-full bg-[var(--link-color)]"></span>
		<span>有文章</span>
	</div>
	<div class="flex items-center gap-1">
		<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
		<span>有备忘</span>
	</div>
	<div class="flex items-center gap-1">
		<Icon icon="material-symbols:touch-app" class="text-sm" />
		<span>点击日期管理备忘</span>
	</div>
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
