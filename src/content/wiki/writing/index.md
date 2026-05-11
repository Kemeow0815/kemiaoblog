---
title: "写作指南"
description: "喵洛阁博客文章写作规范与技巧"
category: "writing"
order: 1
---

# 写作指南

本指南介绍如何在喵洛阁博客中撰写和发布文章。

## 文章位置

博客文章存储在 `src/content/blog/` 目录下，支持以下组织方式：

```
src/content/blog/
├── post-1.md          # 单语言文章
├── post-2.md
└── my-post/           # 多语言文章（文件夹形式）
    ├── zh-cn.md       # 中文版本
    └── en.md          # 英文版本
```

## Frontmatter 配置

每篇文章都需要在顶部添加 frontmatter 配置：

```yaml
---
title: "文章标题"                    # 必填：文章标题
pubDate: 2024-01-15                 # 必填：发布日期
description: "文章简介"              # 可选：文章描述
image: "/path/to/cover.jpg"          # 可选：封面图片
slugId: "unique-post-id"             # 必填：唯一标识（用于多语言）
category: "技术"                     # 可选：分类
tags: ["Astro", "博客"]              # 可选：标签数组
pinTop: 1                           # 可选：置顶优先级（数字越大越靠前）
draft: false                        # 可选：是否为草稿
toc: true                           # 可选：是否显示目录
---
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `pubDate` | date | ✅ | 发布日期，格式 `YYYY-MM-DD` |
| `slugId` | string | ✅ | 唯一标识，用于多语言关联 |
| `description` | string | ❌ | 文章简介，用于 SEO 和列表展示 |
| `image` | string | ❌ | 封面图片路径 |
| `category` | string | ❌ | 文章分类 |
| `tags` | array | ❌ | 标签数组 |
| `pinTop` | number | ❌ | 置顶优先级，0 表示不置顶 |
| `draft` | boolean | ❌ | 草稿状态，true 时生产环境不显示 |
| `toc` | boolean | ❌ | 是否显示文章目录 |

---

## Markdown 语法示例

### 1. 标题

**代码：**

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

**渲染效果：**

# 一级标题
## 二级标题
### 三级标题
#### 四级标题

---

### 2. 文本样式

**代码：**

```markdown
**粗体文本**
*斜体文本*
~~删除线~~
`行内代码`
```

**渲染效果：**

**粗体文本**
*斜体文本*
~~删除线~~
`行内代码`

---

### 3. 列表

**代码：**

```markdown
- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项 A
  - 嵌套列表项 B

1. 有序列表项 1
2. 有序列表项 2
   1. 嵌套有序项
   2. 嵌套有序项
```

**渲染效果：**

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项 A
  - 嵌套列表项 B

1. 有序列表项 1
2. 有序列表项 2
   1. 嵌套有序项
   2. 嵌套有序项

---

### 4. 引用

**代码：**

```markdown
> 这是一段引用文本
> 可以包含多行

> **嵌套引用**
> > 这是嵌套的引用内容
```

**渲染效果：**

> 这是一段引用文本
> 可以包含多行

> **嵌套引用**
> > 这是嵌套的引用内容

---

### 5. 链接与图片

**代码：**

```markdown
[链接文本](https://example.com)
![图片描述](https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/bg.webp)
```

**渲染效果：**

[链接文本](https://example.com)

![博客图标](https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/bg.webp)

---

### 6. 表格

**代码：**

```markdown
| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
```

**渲染效果：**

| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |

---

### 7. 代码块

**代码：**

````markdown
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet('World'));
```

```css
.button {
    background: #3b82f6;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
}
```
````

**渲染效果：**

```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet('World'));
```

```css
.button {
    background: #3b82f6;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
}
```

---

### 8. 数学公式

**代码：**

```markdown
行内公式：$E = mc^2$

块级公式：
$$
\int_{a}^{b} f(x) dx = F(b) - F(a)
$$
```

**渲染效果：**

行内公式：$E = mc^2$

块级公式：
$$
\int_{a}^{b} f(x) dx = F(b) - F(a)
$$

---

## 文章组件

### 提示框（Admonition）

博客支持以下类型的提示框：

**代码：**

```markdown
:::tip
这是一个提示信息，用于展示有用的提示内容。
:::

:::note
这是一个注释信息，用于补充说明。
:::

:::important
这是一个重要信息，需要特别注意。
:::

:::caution
这是一个警告信息，用于提醒用户注意。
:::

:::warning
这是一个危险信息，用于警示重要事项。
:::
```

**渲染效果：**

:::tip
这是一个提示信息，用于展示有用的提示内容。
:::

:::note
这是一个注释信息，用于补充说明。
:::

:::important
这是一个重要信息，需要特别注意。
:::

:::caution
这是一个警告信息，用于提醒用户注意。
:::

:::warning
这是一个危险信息，用于警示重要事项。
:::

---

### 折叠内容

使用 HTML 的 `<details>` 标签实现折叠效果：

**代码：**

```markdown
<details>
<summary>点击展开查看更多内容</summary>

这里是折叠的内容，可以包含：
- 多行文本
- **粗体** 和 *斜体*
- 甚至代码块

```javascript
console.log('Hello from collapsed content!');
```

</details>
```

**渲染效果：**

<details>
<summary>点击展开查看更多内容</summary>

这里是折叠的内容，可以包含：
- 多行文本
- **粗体** 和 *斜体*
- 甚至代码块

```javascript
console.log('Hello from collapsed content!');
```

</details>

---

## 图片使用

### 本地图片

将图片放在 `public/` 目录或文章同级目录：

```markdown
![图片描述](/images/photo.jpg)          # public/images/photo.jpg
![图片描述](./local-image.jpg)           # 文章同级目录
```

### 外链图片

直接使用图片 URL：

```markdown
![图片描述](https://example.com/image.jpg)
```

### 图片优化建议

- 推荐使用 WebP 格式
- 图片宽度建议不超过 1200px
- 使用有意义的 alt 文本
- 压缩图片大小以提升加载速度

---

## 多语言文章

### 创建多语言版本

1. 创建文件夹，以 `slugId` 命名
2. 在文件夹内创建各语言版本

```
src/content/blog/
└── my-post/
    ├── zh-cn.md    # 中文版本
    └── en.md       # 英文版本
```

### Frontmatter 配置

各语言版本的 `slugId` 必须相同：

```yaml
# zh-cn.md
---
title: "文章标题"
slugId: "my-post"
---

# en.md
---
title: "Post Title"
slugId: "my-post"
---
```

---

## 写作技巧

### 文章结构建议

1. **标题**：简洁明了，包含关键词
2. **引言**：概述文章内容，吸引读者
3. **正文**：分段清晰，使用小标题组织
4. **总结**：回顾要点，给出结论
5. **延伸阅读**：相关文章链接

### SEO 优化建议

- 使用描述性的标题（包含关键词）
- 添加合适的 description
- 使用关键词标签
- 添加封面图片
- 合理使用标题层级（H1-H4）
- 添加内部链接

### 排版规范

- 段落之间空一行
- 适当使用列表和表格
- 代码块添加语言标识
- 重要内容使用加粗
- 长段落适当分段

---

## 发布文章

### 本地预览

```bash
npm run dev
```

访问 `http://localhost:4321` 预览文章。

### 构建部署

```bash
npm run build
```

构建后的文件在 `dist/` 目录。

### 草稿发布

将 `draft: true` 改为 `draft: false`，或删除该行即可发布。

---

## 完整示例

以下是一篇完整的示例文章：

```markdown
---
title: "Astro 博客搭建指南"
pubDate: 2024-01-15
description: "详细介绍如何使用 Astro 搭建个人博客"
image: "/images/astro-blog.jpg"
slugId: "astro-blog-guide"
category: "技术"
tags: ["Astro", "博客", "教程"]
pinTop: 1
toc: true
---

# Astro 博客搭建指南

本文将介绍如何使用 Astro 搭建一个高性能的个人博客。

## 为什么选择 Astro

Astro 是一个现代化的静态站点生成器，具有以下优势：

- 🚀 **高性能**：零 JavaScript 默认加载
- 📝 **Markdown 支持**：原生支持 MDX
- 🎨 **框架无关**：支持 React、Vue、Svelte 等
- 🔧 **开发体验**：TypeScript 支持、热更新

## 快速开始

### 1. 创建项目

```bash
npm create astro@latest my-blog
cd my-blog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

## 总结

通过本文的介绍，相信你已经了解了如何使用 Astro 搭建博客。

---

> 📚 **延伸阅读**
> - [Astro 官方文档](https://docs.astro.build/)
> - [主题配置指南](../theme-config/)


---

> 💡 **提示**: 更多写作技巧请参考 [Markdown 指南](https://www.markdownguide.org/)
