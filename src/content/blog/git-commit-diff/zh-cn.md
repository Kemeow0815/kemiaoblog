---
title: 如何添加 Git Commit 更新页面和底部信息
description: 详细介绍如何在博客中集成 Git 提交历史展示功能，包括更新日志页面和页脚 commit 信息
pubDate: 2026-05-14
category: "博客魔改"
slugId: git-commit-diff
image: "https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/git-commit-diff.webp"
draft: false
summary: "文章介绍了如何在博客中集成Git提交历史展示功能，包括更新日志页面和页脚的提交信息，更新日志页面展示完整的提交历史，支持分页浏览；页脚的提交信息在页面底部显示最新的提交信息，GitHubAPI有速率限制，建议配置Token提升到每小时5000次请求，文章还提供了生成新的Token的方法，以及如何编辑仓库信息、添加代码统计等详细步骤，最后，文章还提到了如何自定义样式和适配主题。"
---
## 功能介绍

本博客集成了 Git 提交历史展示功能，包含两个部分：

1. **更新日志页面** (`/diff`) - 展示完整的提交历史，支持分页浏览
2. **页脚 Commit 信息** - 在页面底部显示最新的提交信息

![更新日志页面预览](https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/screenshot-diff.webp)

## 配置步骤

### 1. 配置 GitHub Token（可选但推荐）

GitHub API 有速率限制（未认证每小时 60 次请求），建议配置 Token 提升到每小时 5000 次：

1. 访问 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 生成新的 Token（不需要特殊权限，只需要 `public_repo` 或留空即可）
3. 在 `.env` 文件中添加：

```bash
PUBLIC_GITHUB_TOKEN=your_github_token_here
```

### 2. 修改配置文件

编辑 `src/config.ts`，配置你的仓库信息：

```typescript
export const gitCommitConfig: GitCommitConfig = {
    enable: true,           // 是否启用功能
    repoOwner: "你的用户名",  // GitHub 用户名
    repoName: "你的仓库名",   // 仓库名称
    branch: "main",         // 分支名称
    pageSize: 6,            // 每页显示的提交数量
};
```

### 3. 添加更新日志页面

创建 `src/pages/diff.astro`（或 `[...locale]/diff.astro` 用于多语言）：

```astro
---
import MainPageLayout from '@layouts/MainPageLayout.astro'
import Cover from '@components/Cover.astro'
import { siteConfig, profileConfig, gitCommitConfig } from '@/config'
import { getCommitHistory } from '@/utils/git-info';

const allCommits = gitCommitConfig.enable ? await getCommitHistory(100) : [];
---

<MainPageLayout title="更新日志">
  <Cover title="更新日志" subTitle="记录每一次更新"/>
  <!-- 页面内容 -->
</MainPageLayout>
```

### 4. 在页脚添加 Commit 信息

修改 `src/components/Footer.astro`，添加以下代码：

```astro
---
import { gitCommitConfig } from '@/config'
import { getLatestCommit, formatDate } from '@/utils/git-info'

const latestCommit = gitCommitConfig.enable ? await getLatestCommit() : null
---

{latestCommit && (
  <div class="git-commit-info">
    <a href={`https://github.com/${gitCommitConfig.repoOwner}/${gitCommitConfig.repoName}/commit/${latestCommit.sha}`} target="_blank">
      <span>{latestCommit.shortSha}</span>
      <span>{latestCommit.message.split('\n')[0]}</span>
      <span>{formatDate(latestCommit.date)}</span>
    </a>
  </div>
)}
```

## 功能特性

### 更新日志页面

- ✅ **分页浏览** - 每页显示 6 条提交（可配置）
- ✅ **文件变更详情** - 显示每个提交的文件改动
- ✅ **状态标识** - A(新增)、D(删除)、M(修改)、R(重命名)
- ✅ **代码统计** - 显示增删行数和文件数量
- ✅ **明暗模式适配** - 自动适配博客主题
- ✅ **响应式设计** - 支持移动端浏览

### 页脚信息

- ✅ 显示最新提交的简短 SHA
- ✅ 显示提交信息摘要
- ✅ 显示提交时间
- ✅ 点击跳转到 GitHub 提交详情

## 类型定义

如需在其他地方使用相关类型，可以参考：

```typescript
// src/types/config.ts
type GitCommitConfig = {
  enable: boolean;
  repoOwner: string;
  repoName: string;
  branch: string;
  pageSize: number;
};

// src/utils/git-info.ts
interface CommitInfo {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  date: string;
  totalAdditions: number;
  totalDeletions: number;
  files: FileChange[];
}

interface FileChange {
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
}
```

## 常见问题

<style>
.qa-list {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.qa-item {
  padding: 0;
  border: 1px solid var(--button-border-color);
  border-radius: 12px;
  background: var(--card-color);
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.qa-item:hover {
  border-color: var(--link-color);
}

.qa-item > summary {
  list-style: none;
  cursor: pointer;
  padding: 16px 20px;
}

.qa-item > summary::-webkit-details-marker {
  display: none;
}

.qa-question {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-color);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500;
}

.qa-icon {
  width: 24px;
  height: 24px;
  border: 1px solid var(--button-border-color);
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: var(--text-color-70);
  background: var(--button-hover-color);
  flex: 0 0 24px;
}

.qa-item p,
.qa-item ul,
.qa-item ol {
  margin: 0;
  padding: 0 20px 16px 56px;
  color: var(--text-color-70);
  font-size: 15px;
  line-height: 1.75;
}

.qa-item ul,
.qa-item ol {
  padding-left: 72px;
}

.qa-item li {
  margin: 4px 0;
}

.qa-item code {
  background: var(--button-hover-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
  color: var(--link-color);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .qa-question {
    font-size: 15px;
  }
  
  .qa-item > summary {
    padding: 14px 16px;
  }
  
  .qa-item p,
  .qa-item ul,
  .qa-item ol {
    padding: 0 16px 14px 52px;
    font-size: 14px;
  }
  
  .qa-item ul,
  .qa-item ol {
    padding-left: 68px;
  }
}
</style>

<section class="qa-list" aria-label="常见问题">

<details class="qa-item">
<summary class="qa-question"><span class="qa-icon" aria-hidden="true">Q</span>页面显示 "暂时无法加载更新记录"</summary>

可能是 GitHub API 速率限制导致。解决方案：
1. 配置 `PUBLIC_GITHUB_TOKEN` 提升限额
2. 等待一段时间后刷新页面

</details>

<details class="qa-item">
<summary class="qa-question"><span class="qa-icon" aria-hidden="true">Q</span>如何修改每页显示的提交数量？</summary>

修改 `src/config.ts` 中的 `pageSize` 值：

```typescript
pageSize: 10, // 改为每页 10 条
```

</details>

<details class="qa-item">
<summary class="qa-question"><span class="qa-icon" aria-hidden="true">Q</span>如何禁用这个功能？</summary>

将 `enable` 设为 `false`：

```typescript
enable: false,
```

</details>

<details class="qa-item">
<summary class="qa-question"><span class="qa-icon" aria-hidden="true">Q</span>支持私有仓库吗？</summary>

支持。需要在 GitHub Token 中添加 `repo` 权限，并在配置中正确设置仓库信息。

</details>

</section>

## 样式自定义

更新日志页面使用 CSS 变量适配主题，主要变量：

```css
--card-color          /* 卡片背景色 */
--button-border-color /* 边框颜色 */
--button-hover-color  /* 悬停背景色 */
--link-color          /* 链接颜色 */
--text-color          /* 主文字颜色 */
--text-color-70       /* 次要文字颜色 */
--text-color-50       /* 辅助文字颜色 */
```

你可以在自己的 CSS 中覆盖这些变量来自定义样式。

## 参考链接

- [GitHub REST API - Repositories](https://docs.github.com/en/rest/repos/repos)
- [GitHub REST API - Commits](https://docs.github.com/en/rest/commits/commits)
- [Astro 文档](https://docs.astro.build/)
