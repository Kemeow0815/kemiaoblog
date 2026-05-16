<script lang="ts">
	import Icon from "@iconify/svelte";
	import type { CalendarMemo } from "../types";

	interface Props {
		isOpen: boolean;
		dateKey: string;
		memos: CalendarMemo[];
		onClose: () => void;
		onSave: (content: string) => void;
		onDelete: (memoId: string) => void;
		onUpdate: (memoId: string, content: string) => void;
	}

	const {
		isOpen,
		dateKey,
		memos,
		onClose,
		onSave,
		onDelete,
		onUpdate,
	}: Props = $props();

	let newMemoContent = $state("");
	let editingMemoId: string | null = $state(null);
	let editingContent = $state("");
	let validationError = $state("");

	function formatDateDisplay(dateKey: string): string {
		const [year, month, day] = dateKey.split("-");
		return `${year}年${parseInt(month)}月${parseInt(day)}日`;
	}

	function handleSave() {
		const content = newMemoContent.trim();
		if (!content) {
			validationError = "备忘内容不能为空";
			return;
		}
		if (content.length > 200) {
			validationError = "备忘内容不能超过200字";
			return;
		}
		onSave(content);
		newMemoContent = "";
		validationError = "";
	}

	function startEditing(memo: CalendarMemo) {
		editingMemoId = memo.id;
		editingContent = memo.content;
		validationError = "";
	}

	function cancelEditing() {
		editingMemoId = null;
		editingContent = "";
		validationError = "";
	}

	function handleUpdate(memoId: string) {
		const content = editingContent.trim();
		if (!content) {
			validationError = "备忘内容不能为空";
			return;
		}
		if (content.length > 200) {
			validationError = "备忘内容不能超过200字";
			return;
		}
		onUpdate(memoId, content);
		editingMemoId = null;
		editingContent = "";
		validationError = "";
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			onClose();
		}
	}

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
		onclick={handleOverlayClick}
		onkeydown={handleKeydown}
	>
		<div
			class="w-full max-w-md max-h-[80vh] overflow-hidden rounded-xl border border-[var(--button-border-color)] bg-[var(--bg-color)] shadow-2xl"
		>
			<!-- Header -->
			<div
				class="flex items-center justify-between px-4 py-3 border-b border-[var(--button-border-color)]"
			>
				<h3 class="text-lg font-bold text-[var(--text-color)]">
					{formatDateDisplay(dateKey)} 的备忘
				</h3>
				<button
					type="button"
					class="p-1.5 rounded-lg hover:bg-[var(--button-hover-color)] text-[var(--text-color-70)] transition-colors"
					onclick={onClose}
					aria-label="关闭"
				>
					<Icon icon="material-symbols:close" class="text-xl" />
				</button>
			</div>

			<!-- Content -->
			<div class="p-4 overflow-y-auto max-h-[60vh]">
				<!-- Validation Error -->
				{#if validationError}
					<div
						class="mb-3 px-3 py-2 rounded-lg border border-red-400/30 bg-red-500/10 text-sm text-red-400"
					>
						{validationError}
					</div>
				{/if}

				<!-- Existing Memos -->
				{#if memos.length > 0}
					<div class="space-y-2 mb-4">
						{#each memos as memo (memo.id)}
							<div
								class="p-3 rounded-lg border border-[var(--button-border-color)] bg-[var(--button-hover-color)]/30"
							>
								{#if editingMemoId === memo.id}
									<!-- Editing Mode -->
									<textarea
										class="w-full px-3 py-2 rounded-lg border border-[var(--button-border-color)] bg-[var(--bg-color)] text-sm text-[var(--text-color)] resize-none focus:outline-none focus:border-[var(--link-color)]"
									rows="3"
									bind:value={editingContent}
									placeholder="输入备忘内容..."
								></textarea>
									<div class="flex items-center gap-2 mt-2">
										<button
											type="button"
											class="px-3 py-1.5 rounded-lg bg-[var(--link-color)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
											onclick={() => handleUpdate(memo.id)}
										>
											保存
										</button>
										<button
											type="button"
											class="px-3 py-1.5 rounded-lg border border-[var(--button-border-color)] text-[var(--text-color)] text-sm hover:bg-[var(--button-hover-color)] transition-colors"
											onclick={cancelEditing}
										>
											取消
										</button>
									</div>
								{:else}
									<!-- Display Mode -->
									<div class="flex items-start justify-between gap-2">
										<p
											class="text-sm text-[var(--text-color)] flex-1 whitespace-pre-wrap"
										>
											{memo.content}
										</p>
										<div class="flex items-center gap-1 shrink-0">
											<button
												type="button"
												class="p-1 rounded hover:bg-[var(--button-hover-color)] text-[var(--text-color-70)] transition-colors"
												onclick={() => startEditing(memo)}
												aria-label="编辑"
											>
												<Icon
													icon="material-symbols:edit"
													class="text-base"
												/>
											</button>
											<button
												type="button"
												class="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
												onclick={() => onDelete(memo.id)}
												aria-label="删除"
											>
												<Icon
													icon="material-symbols:delete"
													class="text-base"
												/>
											</button>
										</div>
									</div>
									<p
										class="text-xs text-[var(--text-color-70)] mt-2"
									>
										{new Date(memo.updatedAt).toLocaleString(
											"zh-CN",
											{
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											},
										)}
									</p>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div
						class="text-center py-8 text-[var(--text-color-70)] text-sm"
					>
						暂无备忘，添加一条吧~
					</div>
				{/if}

				<!-- Add New Memo -->
				<div class="border-t border-[var(--button-border-color)] pt-4">
					<h4 class="text-sm font-semibold text-[var(--text-color)] mb-2">
						添加新备忘
					</h4>
					<textarea
						class="w-full px-3 py-2 rounded-lg border border-[var(--button-border-color)] bg-[var(--bg-color)] text-sm text-[var(--text-color)] resize-none focus:outline-none focus:border-[var(--link-color)]"
						rows="3"
						bind:value={newMemoContent}
						placeholder="输入备忘内容..."
					></textarea>
					<div class="flex items-center justify-between mt-2">
						<span class="text-xs text-[var(--text-color-70)]">
							{newMemoContent.length}/200
						</span>
						<button
							type="button"
							class="px-4 py-2 rounded-lg bg-[var(--link-color)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
							onclick={handleSave}
							disabled={!newMemoContent.trim()}
						>
							添加备忘
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
