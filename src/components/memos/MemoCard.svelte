<script lang="ts">
  import i18nit from '../../i18n/translation.ts';
  import { createEventDispatcher } from 'svelte';

  export let dateFormatted = "";
  export let words = 0;
  export let minutes = 0;
  export let language: string = 'zh-cn';
  export let tags: string[] = [];

  const t = i18nit(language);
  const dispatch = createEventDispatcher();

  let isExpanded = false;
  let contentHeight = 0;
  
  // 设定的最大高度阈值 (px)，超过此高度将默认折叠
  const MAX_HEIGHT = 200; 

  // 根据内容高度动态判断是否需要展示"展开/收起"按钮
  $: needsCollapse = contentHeight > MAX_HEIGHT;

  function toggleExpand() {
    isExpanded = !isExpanded;
  }

  function onTagClick(tag: string) {
    dispatch('tagClick', { tag });
  }
</script>

<div class="memo-card rounded-lg p-6 mb-6 shadow-sm border border-[var(--button-border-color)]" >
  <div class="flex items-center justify-between mb-4">
    <span class="text-base font-bold text-[var(--text-color)]">
      {dateFormatted}
    </span>
    <span class="text-sm text-[var(--text-color-70)]">
      {words} {t('memoCard.words')} · {minutes} {t('memoCard.minutes')}
    </span>
  </div>

  <div class="relative">
    <div
      class="markdown-content onload-animation overflow-hidden"
      style="max-height: {needsCollapse && !isExpanded ? MAX_HEIGHT + 'px' : 'none'};"
    >
      <div bind:clientHeight={contentHeight}>
        <slot /> </div>
    </div>

    {#if needsCollapse && !isExpanded}
      <div 
        class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[var(--bg-color,#fff)] to-transparent pointer-events-none"
      ></div>
    {/if}
  </div>

  {#if needsCollapse}
    <div class="mt-2 flex justify-center">
      <button
        class="text-sm hover:text-[var(--link-color)] transition-colors font-bold py-1 px-4 cursor-pointer"
        on:click={toggleExpand}
      >
        {isExpanded ? t('memoCard.collapsed') : t('memoCard.expanded')}
      </button>
    </div>
  {/if}

  <!-- 标签显示 -->
  {#if tags.length > 0}
    <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--button-border-color)]">
      {#each tags as tag}
        <button
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[var(--card-color)] text-[var(--text-color-70)] hover:bg-[var(--link-color)] hover:text-white transition-colors cursor-pointer"
          on:click={() => onTagClick(tag)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {tag}
        </button>
      {/each}
    </div>
  {/if}
</div>
