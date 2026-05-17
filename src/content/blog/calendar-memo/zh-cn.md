---
title: 为 Astro 博客添加日历备忘功能
pubDate: 2026-05-16
description: 详细介绍如何在 Astro 框架的博客中实现一个支持备忘功能的日历组件，包括数据结构设计、组件开发和 JSON 文件存储方案
category: 博客魔改
slugId: calendar/memo
image: "https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/1.webp"
draft: false
summary: "文章介绍了如何在 Astro + Svelte 技术栈的博客中实现日历备忘功能，包括 CalendarMemo 数据结构设计、只读展示组件开发、JSON 文件存储方案，以及响应式布局和明暗模式适配。"
---

## 功能概述

最近给博客的日历页面加了个备忘功能。效果是这样的：点击任意日期会显示当天的备忘事项，数据存储在 JSON 文件中，更换浏览器也能查看。

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
    createdAt: number;   // 时间戳
    updatedAt: number;   // 时间戳
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

备忘数据存储在 JSON 文件中，参考了课程表的数据格式。相比 localStorage，这种方式的好处是：

- 数据持久化在服务器，更换浏览器也能查看
- 可以直接编辑 JSON 文件批量添加备忘
- 便于版本控制和备份

```json
// public/calendar/memos.json
{
  "id": "calendar-memos",
  "name": "日历备忘",
  "version": 1,
  "lastUpdated": 1704067200000,
  "memos": [
    {
      "id": "memo-1",
      "content": "发布新博客文章",
      "date": "2025-01-15",
      "createdAt": 1705276800000,
      "updatedAt": 1705276800000
    }
  ]
}
```

## API 端点

创建 API 端点来读取备忘数据：

```typescript
// src/pages/api/calendar-memos.json.ts
import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";

const MEMOS_FILE_PATH = path.join(
  process.cwd(),
  "public",
  "calendar",
  "memos.json"
);

export const GET: APIRoute = async () => {
  try {
    const data = await fs.readFile(MEMOS_FILE_PATH, "utf-8");
    return new Response(data, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ memos: [] }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};
```

## 数据加载

前端通过 API 加载备忘数据：

```typescript
// src/components/calendar/hooks/useCalendar.ts
const MEMOS_API_URL = "/api/calendar-memos.json";

export async function loadMemosFromStorage(): Promise<CalendarMemo[]> {
  if (typeof window === "undefined") return [];
  try {
    const response = await fetch(MEMOS_API_URL);
    if (response.ok) {
      const data = await response.json();
      return data.memos || [];
    }
  } catch (error) {
    console.error("Failed to load memos from API:", error);
  }
  return [];
}

export function buildMemoDateMap(
  memos: CalendarMemo[]
): Record<string, CalendarMemo[]> {
  const memoDateMap: Record<string, CalendarMemo[]> = {};
  memos.forEach((memo) => {
    if (!memoDateMap[memo.date]) {
      memoDateMap[memo.date] = [];
    }
    memoDateMap[memo.date].push(memo);
  });
  return memoDateMap;
}
```

## 备忘展示

点击日期后，在日历下方展示该日期的备忘列表：

```svelte
<!-- Calendar.svelte -->
<script>
  // 加载备忘数据
  async function loadMemos() {
    allMemos = await loadMemosFromStorage();
    memoDateMap = buildMemoDateMap(allMemos);
  }

  // 点击日期切换选中状态
  function handleCellClick(dateKey: string) {
    if (selectedDateKey === dateKey) {
      selectedDateKey = null;
    } else {
      selectedDateKey = dateKey;
    }
  }

  // 当前选中日期的备忘
  const displayedMemos = $derived(
    selectedDateKey ? memoDateMap[selectedDateKey] || [] : []
  );
</script>

<!-- 备忘展示区域 -->
{#if displayedMemos.length > 0}
  <div class="mt-4">
    <div class="h-[1px] w-full bg-[var(--button-border-color)] mb-2"></div>
    <div class="flex items-center gap-2 mb-2">
      <Icon icon="material-symbols:event-note" class="text-amber-500 text-sm" />
      <span class="text-sm font-medium text-[var(--text-color)]">
        {selectedDateKey} 备忘
      </span>
    </div>
    <div class="flex flex-col gap-2">
      {#each displayedMemos as memo (memo.id)}
        <div class="flex items-start gap-2 px-3 py-2 rounded-lg 
                    bg-amber-500/10 border border-amber-500/20">
          <Icon icon="material-symbols:check-circle" 
                class="text-amber-500 text-sm mt-0.5 shrink-0" />
          <span class="text-sm text-[var(--text-color)]">{memo.content}</span>
        </div>
      {/each}
    </div>
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

## 管理工具

为了方便管理备忘，我写了几个 Node.js 脚本：

### 添加备忘

```bash
# 添加备忘
pnpm newmemo "2026-06-20" "公休"

# 或者直接用 node
node scripts/add-memo.mjs "2026-06-20" "公休"
```

脚本内容：

```javascript
// scripts/add-memo.mjs
import fs from 'fs';
import path from 'path';

function generateId() {
  return `memo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function addMemo(dateStr, content) {
  const data = loadMemos();
  
  const newMemo = {
    id: generateId(),
    content: content.trim(),
    date: normalizeDate(dateStr),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  data.memos.push(newMemo);
  data.lastUpdated = Date.now();
  
  saveMemos(data);
  console.log('✅ 备忘添加成功！');
}
```

### 查看备忘列表

```bash
pnpm listmemo
```

输出示例：

```
📅 日历备忘列表
==================================================
名称: 日历备忘
版本: 1
最后更新: 2026/5/16 14:30:00
备忘数量: 3
==================================================

📌 2025-01
  1. [2025-01-15] 发布新博客文章
  2. [2025-01-20] 更新项目文档

📌 2025-02
  3. [2025-02-01] 备份数据库

==================================================
```

### 删除备忘

```bash
# 先查看列表
pnpm listmemo

# 删除指定序号
pnpm delmemo 1
```

## 响应式与暗色适配

日历的响应式主要靠这几个类：

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

备忘展示区域用 `bg-amber-500/10` 和 `border-amber-500/20`，琥珀色在明暗模式下都能保持较好的可读性。

## 使用说明

添加完功能后，在日历页面底部加了个简单的图例：

::link-card{title="日历页面" link="/calendar"}

- **蓝色圆点**：该日期有发布的文章
- **橙色圆点**：该日期有备忘
- **点击日期**：查看当天备忘

## 文件结构

```
public/calendar/
└── memos.json                  # 备忘数据文件

src/pages/api/
└── calendar-memos.json.ts      # API 端点

src/components/calendar/
├── types.ts                    # 类型定义
├── Calendar.svelte             # 主组件
├── hooks/
│   └── useCalendar.ts          # 工具函数 + 数据加载
└── components/
    ├── CalendarGrid.svelte     # 日历格子
    ├── MonthPicker.svelte      # 月份选择
    └── YearPicker.svelte       # 年份选择

scripts/
├── add-memo.mjs                # 添加备忘脚本
├── list-memos.mjs              # 列表备忘脚本
└── delete-memo.mjs             # 删除备忘脚本
```

## 总结

这个备忘功能实现起来不算复杂，主要是几个部分的组合：

1. **数据层**：定义 TypeScript 接口，用 JSON 文件存储，通过 API 读取
2. **UI 层**：Svelte 组件处理交互，Tailwind 处理样式
3. **工具层**：Node.js 脚本方便管理备忘数据

::tip
如果想进一步扩展，可以考虑：
- 支持备忘分类（工作、生活、学习等）
- 添加备忘优先级标记
- 导出备忘为 Markdown 或 ICS 文件
:::

完整代码已经提交到仓库，有需要的可以参考实现。
