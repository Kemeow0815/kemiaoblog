<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import i18nit from '../../i18n/translation.ts';

  export let language: string = 'zh-cn';
  export let memoApiUrl: string = '';
  export let memoApiToken: string = '';

  const t = i18nit(language);

  let remoteMemos: any[] = [];
  let currentPage = 1;
  let hasMore = false;
  let loading = false;
  let error: string | null = null;
  const pageSize = 5;

  // 标签筛选相关
  let selectedTag: string | null = null;
  let allTags: string[] = [];

  // 获取所有标签
  function extractTags(memos: any[]): string[] {
    const tagSet = new Set<string>();
    memos.forEach(memo => {
      const tags = memo.tags || [];
      if (Array.isArray(tags)) {
        tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }

  // 筛选后的远程 memos
  $: filteredRemoteMemos = selectedTag
    ? remoteMemos.filter(memo => {
        const tags = memo.tags || [];
        return Array.isArray(tags) && tags.includes(selectedTag);
      })
    : remoteMemos;

  // 更新所有标签列表
  $: {
    allTags = extractTags(remoteMemos);
  }

  // 选择标签
  function selectTag(tag: string | null) {
    selectedTag = selectedTag === tag ? null : tag;
    currentPage = 1;
  }

  // 格式化日期
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'zh-cn' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 获取远程 memos
  async function fetchRemoteMemos(page: number = 1) {
    if (!memoApiUrl) {
      error = 'API URL not configured';
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      const offset = (page - 1) * pageSize;
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (memoApiToken) {
        headers['Authorization'] = `Bearer ${memoApiToken}`;
      }
      
      const apiUrls = [
        `${memoApiUrl}/api/v1/memos?pageSize=${pageSize}&offset=${offset}`,
        `${memoApiUrl}/api/v1/memo?pageSize=${pageSize}&offset=${offset}`,
        `${memoApiUrl}/api/v1/memos?limit=${pageSize}&offset=${offset}`,
        `${memoApiUrl}/api/v1/memo?limit=${pageSize}&offset=${offset}`,
      ];
      
      let lastError: Error | null = null;
      let response = null;
      
      for (const url of apiUrls) {
        try {
          response = await fetch(url, {
            method: 'GET',
            headers,
            mode: 'cors',
          });
          
          if (response.ok) break;
        } catch (e) {
          lastError = e as Error;
        }
      }
      
      if (!response || !response.ok) {
        throw lastError || new Error(`HTTP error! status: ${response?.status || 'unknown'}`);
      }
      
      const data = await response.json();
      
      let memos = [];
      if (Array.isArray(data)) {
        memos = data;
      } else if (data.memos && Array.isArray(data.memos)) {
        memos = data.memos;
      } else if (data.data && Array.isArray(data.data)) {
        memos = data.data;
      } else if (data.results && Array.isArray(data.results)) {
        memos = data.results;
      } else {
        const possibleArrays = Object.values(data).filter(v => Array.isArray(v));
        if (possibleArrays.length > 0) {
          memos = possibleArrays[0] as any[];
        }
      }
      
      remoteMemos = memos;
      hasMore = memos.length === pageSize;
      
    } catch (err) {
      console.error('Failed to fetch remote memos:', err);
      error = err instanceof Error ? err.message : 'Failed to fetch data';
      remoteMemos = [];
    } finally {
      loading = false;
    }
  }

  // 切换页码
  function changePage(page: number) {
    if (page < 1 || page === currentPage) return;
    currentPage = page;
    fetchRemoteMemos(page);
  }

  // 重试加载
  function retry() {
    error = null;
    fetchRemoteMemos(currentPage);
  }

  onMount(() => {
    fetchRemoteMemos(1);
  });
</script>

<div class="remote-memos">
  <!-- 标签筛选栏 -->
  {#if allTags.length > 0}
    <div class="mb-6 px-4">
      <div class="flex flex-wrap items-center gap-2 justify-center">
        <button
          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 {selectedTag === null ? 'bg-[var(--link-color)] text-white' : 'bg-[var(--card-color)] text-[var(--text-color-70)] hover:bg-[var(--btn-bg)] hover:text-[var(--btn-text)]'}"
          on:click={() => selectTag(null)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          全部
        </button>
        {#each allTags as tag}
          <button
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 {selectedTag === tag ? 'bg-[var(--link-color)] text-white' : 'bg-[var(--card-color)] text-[var(--text-color-70)] hover:bg-[var(--btn-bg)] hover:text-[var(--btn-text)]'}"
            on:click={() => selectTag(tag)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {tag}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if loading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--link-color)]"></div>
    </div>
  {:else if error}
    <div class="text-center py-12 px-4">
      <p class="text-[var(--text-color-70)] mb-4">加载失败: {error}</p>
      {#if !memoApiToken}
        <p class="text-sm text-[var(--text-color-50)] mb-4">
          提示: Memos API 可能需要 Access Token。
        </p>
      {/if}
      <button 
        class="px-4 py-2 rounded-lg bg-[var(--btn-bg)] text-[var(--btn-text)] hover:opacity-80 transition-opacity"
        on:click={retry}
      >
        重试
      </button>
    </div>
  {:else if filteredRemoteMemos.length === 0}
    <div class="text-center py-12 text-[var(--text-color-70)]">
      {selectedTag ? '该标签下暂无数据' : (t('memoTabs.noData') || '暂无数据')}
    </div>
  {:else}
    {#if selectedTag}
      <div class="text-center mb-4 text-sm text-[var(--text-color-70)]">
        正在筛选标签: <span class="font-medium text-[var(--link-color)]">{selectedTag}</span>
        <button 
          class="ml-2 text-xs underline hover:text-[var(--text-color)]"
          on:click={() => selectTag(null)}
        >
          清除筛选
        </button>
      </div>
    {/if}
    <div class="space-y-6">
      {#each filteredRemoteMemos as memo (memo.name || memo.id || memo.uid)}
        {@const renderedContent = marked.parse(memo.content || memo.snippet || memo.body || memo.text || memo.message || '')}
        <div class="memo-card rounded-lg p-6 shadow-sm border border-[var(--button-border-color)]">
          <div class="flex items-center justify-between mb-4">
            <span class="text-base font-bold text-[var(--text-color)]">
              {formatDate(memo.createTime || memo.createdAt || memo.create_at || memo.create_time || new Date().toISOString())}
            </span>
          </div>
          <div class="markdown-content text-[var(--text-color)]">
            {@html renderedContent}
          </div>
          
          <!-- 标签显示 -->
          {#if memo.tags && memo.tags.length > 0}
            <div class="flex flex-wrap gap-2 mt-4">
              {#each memo.tags as tag}
                <button
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[var(--card-color)] text-[var(--text-color-70)] hover:bg-[var(--link-color)] hover:text-white transition-colors cursor-pointer"
                  on:click={() => selectTag(tag)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {tag}
                </button>
              {/each}
            </div>
          {/if}
          
          {#if memo.resources && memo.resources.length > 0}
            <div class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {#each memo.resources as resource}
                {#if resource.type && resource.type.startsWith('image/')}
                  <img 
                    src={`${memoApiUrl}/o/r/${resource.uid}/${resource.filename}`}
                    alt={resource.filename}
                    class="rounded-lg w-full h-32 object-cover"
                    loading="lazy"
                  />
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- 分页 -->
    <div class="flex justify-center items-center gap-2 mt-8">
      <button
        class="px-4 py-2 rounded-lg border border-[var(--button-border-color)] text-[var(--text-color)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--card-color)] transition-colors"
        disabled={currentPage === 1}
        on:click={() => changePage(currentPage - 1)}
      >
        {t('pagination.prev') || '上一页'}
      </button>
      
      <span class="px-4 py-2 text-[var(--text-color)]">
        {currentPage}
      </span>
      
      <button
        class="px-4 py-2 rounded-lg border border-[var(--button-border-color)] text-[var(--text-color)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--card-color)] transition-colors"
        disabled={!hasMore}
        on:click={() => changePage(currentPage + 1)}
      >
        {t('pagination.next') || '下一页'}
      </button>
    </div>
  {/if}
</div>
