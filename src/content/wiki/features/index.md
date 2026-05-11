---
title: "博客功能特性"
description: "喵洛阁博客的核心功能与特性介绍"
category: "features"
order: 1
---

# 博客功能特性

喵洛阁博客主题集成了丰富的功能，为博主提供完整的写作和展示体验。

## 核心功能

### 📝 文章系统

**Markdown 支持**
- 完整的 Markdown 语法支持
- 代码块语法高亮（Shiki）
- 数学公式（KaTeX）
- 表格、列表、引用等

**文章特性**
- 文章分类与标签
- 置顶文章
- 草稿模式
- 阅读时间估算
- 字数统计

**文章导航**
- 上一篇/下一篇导航
- 文章目录（TOC）
- 面包屑导航
- 相关文章推荐

---

### 🎨 主题系统

**明暗模式**
- 自动检测系统主题
- 手动切换按钮
- 平滑过渡动画
- 独立的颜色变量

**响应式设计**
- 移动端优先
- 平板适配
- 桌面端优化
- 自适应布局

**动画效果**
- AOS 滚动动画
- 页面过渡动画
- 悬浮效果
- 加载动画

---

### 💬 评论系统

**Momo 评论**
- 基于 Momo 后端
- 支持回复
- 邮件通知
- 管理员后台

**Twikoo 支持**
- 可选 Twikoo 评论
- 腾讯云开发
- 微信通知
- 垃圾评论过滤

---

### 🖼️ 图片处理

**灯箱浏览**
- PhotoSwipe 灯箱
- 手势支持
- 缩略图导航
- 全屏浏览

**图片优化**
- LQIP 低质量占位
- 懒加载
- WebP 格式支持
- 响应式图片

---

## 特色功能

### 🔗 友链系统

- 友链展示页面
- 朋友圈动态聚合
- 友链状态监控
- 数据接口支持

### 📊 数据展示

- 课程表展示
- 设备清单
- 代码片段库
- 即刻短文

### 🌐 国际化

- 多语言支持
- 自动语言检测
- 语言切换
- 路由本地化

### 🔍 SEO 优化

- 自动生成 Sitemap
- Open Graph 标签
- Twitter Card 支持
- 结构化数据

---

## 技术特性

### ⚡ 性能优化

- 静态站点生成（SSG）
- 零 JavaScript 默认
- 按需加载组件
- 图片优化
- 代码分割

### 🔧 开发体验

- TypeScript 支持
- 热更新（HMR）
- 类型检查
- ESLint 集成

### 📦 部署支持

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- 自有服务器

---

## 功能配置

在 `src/config.ts` 中启用或禁用功能：

```typescript
export const siteConfig: SiteConfig = {
    // 文章分页
    pageSize: 6,
    
    // 目录配置
    toc: {
        enable: true,
        depth: 3
    },
    
    // 文章导航
    blogNavi: {
        enable: true
    },
    
    // 评论配置
    comments: {
        enable: true,
        platform: "default",
        backendUrl: "https://your-comment-api.com"
    },
    
    // 主题功能
    theme: {
        AOS: true,        // 滚动动画
        LQIP: true,       // 图片占位
        PhotoSwipe: true  // 灯箱浏览
    }
}
```

---

## 扩展功能

### 自定义组件

博客支持在 Markdown 中使用自定义组件：

```markdown
<!-- 提示框 -->
:::tip
这是一个提示信息
:::

<!-- 警告框 -->
:::warning
这是一个警告信息
:::

<!-- 折叠内容 -->
:::details 点击展开
折叠的内容
:::
```

### 短代码

支持多种短代码扩展：

```markdown
<!-- 图片画廊 -->
{% gallery %}
![图片1](/path/to/image1.jpg)
![图片2](/path/to/image2.jpg)
{% endgallery %}

<!-- 视频嵌入 -->
{% video https://example.com/video.mp4 %}
```

---

> 💡 **提示**: 更多功能详细介绍请查看左侧导航。
