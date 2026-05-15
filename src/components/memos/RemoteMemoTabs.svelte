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
  
  // 存储每页的 pageToken，用于分页导航
  let pageTokens: (string | undefined)[] = [undefined]; // 第1页的token是undefined

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
    // 重置分页 token
    pageTokens = [undefined];
    fetchRemoteMemos(1);
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
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (memoApiToken) {
        headers['Authorization'] = `Bearer ${memoApiToken}`;
      }
      
      // 获取当前页的 pageToken
      const pageToken = pageTokens[page - 1];
      const tokenParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
      
      const apiUrl = `${memoApiUrl}/api/v1/memos?pageSize=${pageSize}${tokenParam}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Memos API v1 返回格式: { memos: [...], nextPageToken: "..." }
      let memos = [];
      if (data.memos && Array.isArray(data.memos)) {
        memos = data.memos;
      } else if (Array.isArray(data)) {
        memos = data;
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
      
      // 更新分页状态
      const nextPageToken = data.nextPageToken;
      hasMore = !!nextPageToken && memos.length === pageSize;
      
      // 存储下一页的 token
      if (nextPageToken && pageTokens.length <= page) {
        pageTokens[page] = nextPageToken;
      }
      
    } catch (err) {
      console.error('Failed to fetch remote memos:', err);
      error = err instanceof Error ? err.message : 'Failed to fetch data';
      remoteMemos = [];
      hasMore = false;
    } finally {
      loading = false;
    }
  }

  // 切换页码
  function changePage(page: number) {
    if (page < 1 || page === currentPage) return;
    
    // 如果跳转到之前访问过的页面，直接使用缓存的 token
    if (page < pageTokens.length) {
      currentPage = page;
      fetchRemoteMemos(page);
      return;
    }
    
    // 只能一页一页地前进（因为需要上一页的 nextPageToken）
    if (page > currentPage + 1) {
      // 逐页加载直到目标页
      const targetPage = page;
      const loadNext = async () => {
        if (currentPage < targetPage && hasMore) {
          currentPage++;
          await fetchRemoteMemos(currentPage);
          if (currentPage < targetPage) {
            setTimeout(loadNext, 100);
          }
        }
      };
      loadNext();
      return;
    }
    
    currentPage = page;
    fetchRemoteMemos(page);
  }

  // 重试加载
  function retry() {
    error = null;
    // 如果是第一页，重置所有 token
    if (currentPage === 1) {
      pageTokens = [undefined];
    }
    fetchRemoteMemos(currentPage);
  }

  onMount(() => {
    fetchRemoteMemos(1);
    
    // 初始化灯箱功能
    setupLightbox();
    
    // 监听 Astro 页面导航后重新设置灯箱
    document.addEventListener('astro:page-load', setupLightbox);
    
    return () => {
      document.removeEventListener('astro:page-load', setupLightbox);
    };
  });
  
  // 灯箱功能 - 使用事件委托，绑定在 document 上
  function setupLightbox() {
    // 移除已存在的事件监听器，避免重复绑定
    document.removeEventListener('click', handleLightboxClick);
    document.removeEventListener('keydown', handleLightboxKeydown);
    
    // 绑定点击事件
    document.addEventListener('click', handleLightboxClick);
    
    // 绑定键盘事件
    document.addEventListener('keydown', handleLightboxKeydown);
  }
  
  function handleLightboxClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    
    // 检查点击的是否是 markdown-content 中的图片
    if (target.tagName === 'IMG' && target.closest('.markdown-content')) {
      e.preventDefault();
      openLightbox(target as HTMLImageElement);
    }
    
    // 点击遮罩层关闭灯箱
    if (target.classList.contains('lightbox-overlay')) {
      closeLightbox();
    }
  }
  
  function handleLightboxKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  }
  
  function openLightbox(img: HTMLImageElement) {
    // 移除已存在的灯箱
    closeLightbox();
    
    // 创建灯箱遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    
    // 创建大图
    const lightboxImg = document.createElement('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    
    overlay.appendChild(lightboxImg);
    document.body.appendChild(overlay);
    
    // 触发重绘以启动动画
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    const overlay = document.querySelector('.lightbox-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
    document.body.style.overflow = '';
  }
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

<style>
  /* 限制 Markdown 内容中的图片大小 */
  :global(.markdown-content img) {
    max-width: 300px;
    max-height: 400px;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 0.5rem;
    display: block;
    margin: 0.5rem 0;
    cursor: zoom-in;
    transition: transform 0.2s ease;
  }
  
  :global(.markdown-content img:hover) {
    transform: scale(1.02);
  }
  
  /* 灯箱遮罩层 */
  :global(.lightbox-overlay) {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: zoom-out;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  :global(.lightbox-overlay.active) {
    opacity: 1;
  }
  
  :global(.lightbox-overlay img) {
    max-width: 90vw;
    max-height: 90vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 0.5rem;
    cursor: zoom-out;
  }
</style>
