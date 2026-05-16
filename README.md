# 喵洛阁 (Momo Blog)

<div align="center">
    <p>一个极简的 Blog 模板，使用 <a href="https://astro.build/">Astro</a> + <a href="https://svelte.dev/">Svelte</a> 搭建</p>
    <p>
        <a href="https://blog.kemeow.top">🌐 在线预览</a> •
        <a href="./doc/config_zh-cn.md">⚙️ 配置指南</a> •
        <a href="./doc/release_zh-cn.md">📦 更新指南</a>
    </p>
</div>

## ✨ 特性

* **极简设计**：页面设计简约，黑白为主色调，蓝色进行点缀
* **深色模式**：支持手动切换或自动跟随系统
* **文章搜索功能**：使用 [Pagefind](https://pagefind.app/) 实现本地化搜索功能
* **国际化（i18n）**：支持多语言切换，目前支持简体中文、英文
* **移动端适配**：组件针对移动端进行优化，拥有和电脑浏览器一样的流畅体验
* **评论功能**：支持 Momo 后端和 Twikoo，具体参考 [Momo-Backend](https://github.com/Motues/Momo-Backend)
* **丰富的 Markdown 语法**：支持 KaTeX、Typst、Alert 组件、GitHub 卡片、自定义语法等
* **友链监控**：实时监控友链可访问性
* **日历备忘**：支持日历形式的备忘录功能
* **即刻短文**：类似微博的短内容发布
* **代码片段**：管理和展示常用代码片段
* **Wiki 文档**：知识库与文档中心
* **音乐播放器**：内置音乐播放功能
* **画廊相册**：支持图片集展示
* **课程表**：展示个人课程安排
* **Git 提交历史**：展示文章 Git 提交记录
* 其他基本功能：文章分类、目录、RSS 订阅、文字统计、阅读时间

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装步骤

1. 克隆本项目
    ```bash
    git clone https://github.com/Kemeow0815/kemiaoblog.git
    cd kemiaoblog
    ```

2. 安装依赖
    ```bash
    pnpm install
    ```

3. 启动开发服务器
    ```bash
    pnpm dev
    ```
    访问 `http://localhost:4321` 查看效果

4. 构建生产版本
    ```bash
    pnpm build
    ```

## 🔧 配置

### 基础配置

编辑 `src/config.ts` 文件：

```typescript
export const siteConfig: SiteConfig = {
    title: "喵洛阁",           // 网站标题
    subTitle: "KeMiao - Blog", // 网站副标题
    favicon: "/favicon/favicon.ico",
    pageSize: 6,               // 每页文章数
    toc: {
        enable: true,
        depth: 3               // 目录深度 1-4
    },
    comments: {
        enable: true,
        platform: "default",   // 评论平台: default / twikoo
        backendUrl: "https://your-backend-url"
    },
    theme: {
        AOS: true,             // 滚动动画
        LQIP: true,            // 图片占位
        PhotoSwipe: true       // 图片灯箱
    }
}
```

### 个人资料配置

```typescript
export const profileConfig: ProfileConfig = {
    avatar: "assets/avatar.png",
    name: "克喵爱吃卤面",
    description: "每一段旅行，都有终点",
    indexPage: "https://your-homepage.com",
    startYear: 2024,
}
```

### 友链监控配置

```typescript
export const monitorConfig = {
    enable: true,
    apiUrl: "https://your-monitor-api.com",
    pageTitle: "友链监测",
    pageSubTitle: "实时监控友链可访问性"
}
```

更多配置请参考 [配置指南](./doc/config_zh-cn.md)

## 📂 项目结构

```
.
├── public/                 # 静态资源
│   ├── images/            # 图片资源
│   ├── js/                # 客户端脚本
│   └── styles/            # 全局样式
├── src/
│   ├── assets/            # 项目资源（头像等）
│   ├── components/        # 组件
│   │   ├── albums/       # 相册组件
│   │   ├── calendar/     # 日历组件
│   │   ├── comment/      # 评论组件
│   │   ├── control/      # 控制组件（导航、主题等）
│   │   ├── memos/        # 即刻短文组件
│   │   ├── music-player/ # 音乐播放器组件
│   │   └── ...
│   ├── content/          # 内容文件
│   │   ├── blog/        # 博客文章
│   │   ├── memos/       # 即刻短文
│   │   ├── snippets/    # 代码片段
│   │   ├── spec/        # 特殊页面（关于、友链）
│   │   └── wiki/        # Wiki 文档
│   ├── i18n/            # 国际化配置
│   ├── layouts/         # 布局模板
│   ├── pages/           # 页面路由
│   ├── plugins/         # 自定义插件
│   ├── styles/          # 样式文件
│   ├── types/           # TypeScript 类型定义
│   └── utils/           # 工具函数
├── scripts/             # 构建脚本
├── astro.config.mjs     # Astro 配置
├── tailwind.config.js   # Tailwind 配置
└── package.json         # 项目依赖
```

## 📝 内容创作

### 创建新文章

```bash
pnpm newpost <path> <lang>
# 示例：pnpm newpost blog/my-post.md zh-cn
```

### 文章 Frontmatter

```yaml
---
title: 文章标题
description: 文章描述
date: 2025-01-01
tags: [标签1, 标签2]
category: 分类
cover: /images/cover.jpg
draft: false
---
```

### 支持的 Markdown 扩展

- **数学公式**：使用 `$...$` 或 `$$...$$` 编写 KaTeX 公式
- **Typst**：支持 Typst 语法
- **自定义组件**：
  - GitHub 卡片：`::github{repo="user/repo"}`
  - 音乐卡片：`::music{url="..."}`
  - 提示框：`:::tip/:::warning/:::danger 内容 :::`
  - 时间线、标签页、对话组件等

## ⚡ 指令

| 指令 | 作用 |
|------|------|
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动开发服务器 (`http://localhost:4321`) |
| `pnpm build` | 构建生产版本到 `./dist` |
| `pnpm preview` | 预览构建后的版本 |
| `pnpm newpost <path> [lang]` | 创建新文章 |
| `pnpm test` | 构建并预览 |

## 🍃 分支

- `main`：主分支，稳定版本
- `memos`：实现 Memos 卡片功能
- `v6`：Astro v6 升级分支

## 📚 技术栈

- [Astro](https://astro.build/) - 静态站点生成器
- [Svelte 5](https://svelte.dev/) - 交互式组件
- [Tailwind CSS v4](https://tailwindcss.com/) - 样式框架
- [Pagefind](https://pagefind.app/) - 静态搜索
- [PhotoSwipe](https://photoswipe.com/) - 图片灯箱
- [KaTeX](https://katex.org/) - 数学公式渲染
- [Shiki](https://shiki.style/) - 代码高亮

## 📄 许可证

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## 🙏 致谢

- [Astro](https://astro.build/)
- [Fuwari](https://github.com/saicaca/fuwari)
- [Tyndall](https://github.com/moyuin-aka/tyndall-public)
- [Momo](https://github.com/Motues/Momo) - 原主题

---

<div align="center">
    <p>Made with ❤️ by <a href="https://github.com/Kemeow0815">克喵爱吃卤面</a></p>
</div>
