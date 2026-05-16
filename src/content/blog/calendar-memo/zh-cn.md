---
title: 为 Astro 博客添加日历备忘功能
pubDate: 2026-05-16
description: 详细介绍如何在 Astro 框架的博客中实现一个支持备忘功能的日历组件，包括数据结构设计、组件开发和本地存储方案
category: 博客魔改
slugId: calendar/memo
image: "https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/1.webp"
draft: false
summary: "文章介绍了如何在 Astro + Svelte 技术栈的博客中实现日历备忘功能，包括 CalendarMemo 数据结构设计、MemoEditor 弹窗组件开发、localStorage 本地存储方案，以及响应式布局和明暗模式适配。"
---

## 功能概述

最近给博客的日历页面加了个备忘功能。效果是这样的：点击任意日期会弹出一个编辑器，可以添加、修改、删除当天的备忘事项。数据存在浏览器本地，刷新页面也不会丢失。

::pic{src="https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/1.webp" caption="日历备忘功能效果预览"}

## 技术栈背景

博客基于 **Astro** 框架构建，日历组件使用 **Svelte** 开发，样式用 **Tailwind CSS**。选择这个组合的原因是：

- Astro 的 Islands 架构让日历组件可以只在需要时 hydration
- Svelte 的响应式语法写交互逻辑很顺手
- Tailwind 处理响应式和暗色模式比较方便

## 数据结构设计

首先定义备忘的数据结构。一个备忘需要包含：唯一 ID、内容、日期、创建和更新时间。

```typescript
// src/components/calendar/types.ts
export interface CalendarMemo {
    id: string;
    content: string;
    date: string;        // 格式：YYYY-MM-DD
    createdAt: number;
    updatedAt: number;
}
```

同时扩展日历格子的类型，让它能显示备忘信息：

```typescript
export interface CalendarGridCell {
    day: number;
    dateKey: string;
    posts: CalendarPost[];
    memos: CalendarMemo[];      // 新增：当天的备忘列表
    hasPost: boolean;
    hasMemo: boolean;           // 新增：是否有备忘
    postCount: number;
    memoCount: number;          // 新增：备忘数量
    isToday: boolean;
    isSelected: boolean;
    isEmpty: boolean;
}
```

## 存储方案选择

备忘数据量不大，也不需要跨设备同步，用 **localStorage** 存本地就够了。比搭建后端服务简单很多。

```typescript
// src/components/calendar/hooks/useCalendar.ts
const MEMO_STORAGE_KEY = "calendar-memos";

export function loadMemosFromStorage(): CalendarMemo[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(MEMO_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (error) {
        console.error("Failed to load memos:", error);
    }
    return [];
}

export function saveMemosToStorage(memos: CalendarMemo[]): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos));
    } catch (error) {
        console.error("Failed to save memos:", error);
    }
}
```

:::note
服务端渲染时 `window` 不存在，所以要先做判断，避免报错。
:::

## 编辑弹窗组件

备忘的增删改都在一个弹窗里完成。参考了课程表编辑器的交互方式：列表展示已有备忘，底部表单添加新备忘。

### 组件结构

```svelte
<!-- MemoEditor.svelte 核心结构 -->
{#if isOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 
                bg-black/50 backdrop-blur-sm"
         onclick={handleOverlayClick}
         onkeydown={handleKeydown}>
        <div class="w-full max-w-md max-h-[80vh] overflow-hidden 
                    rounded-xl border border-[var(--button-border-color)] 
                    bg-[var(--bg-color)] shadow-2xl">
            <!-- 头部：显示日期 -->
            <div class="flex items-center justify-between px-4 py-3 
                        border-b border-[var(--button-border-color)]">
                <h3>{formattedDate} 的备忘</h3>
                <button onclick={onClose}>关闭</button>
            </div>
            
            <!-- 内容区：已有备忘列表 -->
            <div class="p-4 overflow-y-auto max-h-[60vh]">
                {#if memos.length > 0}
                    <div class="space-y-2 mb-4">
                        {#each memos as memo}
                            <MemoItem {memo} 
                                onEdit={startEditing}
                                onDelete={() => onDelete(memo.id)} />
                        {/each}
                    </div>
                {:else}
                    <div class="text-center py-8 text-[var(--text-color-70)]">
                        暂无备忘，添加一条吧~
                    </div>
                {/if}
                
                <!-- 添加新备忘表单 -->
                <div class="border-t border-[var(--button-border-color)] pt-4">
                    <h4>添加新备忘</h4>
                    <textarea bind:value={newMemoContent}
                        placeholder="输入备忘内容..."
                        rows="3" />
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-xs">{newMemoContent.length}/200</span>
                        <button onclick={handleSave}>添加备忘</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
```

### 编辑状态管理

每个备忘项有两种状态：展示模式和编辑模式。点击编辑按钮切换到编辑模式，显示文本框和保存/取消按钮。

```svelte
{#if editingMemoId === memo.id}
    <!-- 编辑模式 -->
    <textarea bind:value={editingContent} rows="3" />
    <div class="flex gap-2 mt-2">
        <button onclick={() => handleUpdate(memo.id)}>保存</button>
        <button onclick={cancelEditing}>取消</button>
    </div>
{:else}
    <!-- 展示模式 -->
    <p>{memo.content}</p>
    <div class="flex gap-1">
        <button onclick={() => startEditing(memo)}>编辑</button>
        <button onclick={() => onDelete(memo.id)}>删除</button>
    </div>
{/if}
```

## 日历格子标记

有备忘的日期需要在日历上显示标记，让用户一眼就能看到。我在日期格子的底部加了个橙色小圆点，跟文章标记的蓝色圆点区分开。

```svelte
<!-- CalendarGrid.svelte -->
<button class={getCellClass(cell)} onclick={() => handleCellClick(cell)}>
    {cell.day}
    
    <!-- 标记点：文章(蓝) + 备忘(橙) -->
    {#if (cell.hasPost || cell.hasMemo) && !cell.isSelected}
        <span class="absolute bottom-0.5 flex gap-0.5">
            {#if cell.hasPost}
                <span class="w-1 h-1 rounded-full bg-[var(--link-color)]"></span>
            {/if}
            {#if cell.hasMemo}
                <span class="w-1 h-1 rounded-full bg-amber-500"></span>
            {/if}
        </span>
    {/if}
</button>
```

## 主组件集成

日历主组件负责协调各个子组件，管理备忘数据的加载和保存。

```svelte
<!-- Calendar.svelte 核心逻辑 -->
<script>
    // 备忘状态
    let allMemos = $state([]);
    let memoDateMap = $state({});
    let isMemoEditorOpen = $state(false);
    let editingDateKey = $state(null);

    // 初始化时加载备忘
    onMount(() => {
        fetchCalendarData();
        loadMemos();
    });

    function loadMemos() {
        allMemos = loadMemosFromStorage();
        memoDateMap = buildMemoDateMap(allMemos);
    }

    // 点击日期打开编辑器
    function handleCellClick(dateKey: string) {
        editingDateKey = dateKey;
        isMemoEditorOpen = true;
    }

    // 保存备忘
    function handleSaveMemo(content: string) {
        if (!editingDateKey) return;
        const newMemo = createMemo(content, editingDateKey);
        allMemos = [...allMemos, newMemo];
        memoDateMap = buildMemoDateMap(allMemos);
        saveMemosToStorage(allMemos);
    }
</script>

<CalendarGrid {cells} onCellClick={handleCellClick} />

<MemoEditor 
    isOpen={isMemoEditorOpen}
    dateKey={editingDateKey}
    memos={memoDateMap[editingDateKey] || []}
    onClose={() => isMemoEditorOpen = false}
    onSave={handleSaveMemo}
    onDelete={handleDeleteMemo}
    onUpdate={handleUpdateMemo} />
```

## 响应式与暗色适配

弹窗的响应式主要靠这几个类：

```
w-full max-w-md          → 移动端全宽，桌面端最大 448px
max-h-[80vh]             → 最大高度限制，避免超出屏幕
overflow-y-auto          → 内容过多时可滚动
p-4                      → 移动端留边距，桌面端也适用
```

暗色模式通过 CSS 变量自动适配：

```css
/* 亮色模式 */
--bg-color: #ffffff;
--text-color: #1a1a1a;
--button-border-color: #e5e5e5;

/* 暗色模式 */
--bg-color: #1a1a1a;
--text-color: #e5e5e5;
--button-border-color: #333333;
```

弹窗背景用 `bg-[var(--bg-color)]`，文字用 `text-[var(--text-color)]`，就能自动跟随主题切换。

## 使用说明

添加完功能后，在日历页面底部加了个简单的图例：

::link-card{title="日历页面" link="/calendar"}

- **蓝色圆点**：该日期有发布的文章
- **橙色圆点**：该日期有备忘
- **点击日期**：打开备忘编辑器

## 文件结构

```
src/components/calendar/
├── types.ts                    # 类型定义
├── Calendar.svelte             # 主组件
├── hooks/
│   └── useCalendar.ts          # 工具函数 + 存储逻辑
└── components/
    ├── CalendarGrid.svelte     # 日历格子
    ├── MemoEditor.svelte       # 备忘编辑器
    ├── MonthPicker.svelte      # 月份选择
    └── YearPicker.svelte       # 年份选择
```

## 总结

这个备忘功能实现起来不算复杂，主要是几个部分的组合：

1. **数据层**：定义 TypeScript 接口，用 localStorage 持久化
2. **UI 层**：Svelte 组件处理交互，Tailwind 处理样式
3. **集成层**：主组件协调数据流和组件通信

::tip
如果想进一步扩展，可以考虑：
- 支持备忘的拖拽排序
- 添加备忘提醒功能
- 导出备忘为 Markdown 文件
:::

完整代码已经提交到仓库，有需要的可以参考实现。
