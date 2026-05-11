---
title: 组件展示
pubDate: 2026-05-11
description: 展示博客中可用的 Markdown 组件和增强功能
image: ""
draft: false
slugId: component-show
summary: "本文展示了博客中可用的增强链接组件，包括自动图标识别、外部链接标记和自定义图标等功能。"
---

## 增强链接 ProseLink

博客支持增强的 Markdown 链接功能，可以自动识别外部链接并添加对应的网站图标。

### 基本用法

**内部链接**：[返回首页](/) - 不会添加外部链接标记

**外部链接**：[GitHub](https://github.com)、[Bilibili](https://www.bilibili.com)、[知乎](https://www.zhihu.com) - 自动添加图标和外部链接标记

### 自动图标识别

系统会根据链接的域名自动匹配对应的图标：

- [微软文档](https://learn.microsoft.com/zh-cn/) - Microsoft 图标
- [GitHub](https://github.com/) - GitHub 图标
- [Bilibili](https://www.bilibili.com/) - Bilibili 图标
- [QQ 官网](https://im.qq.com/) - QQ 图标
- [微信公众号](https://mp.weixin.qq.com/) - 微信图标
- [Google](https://google.com) - Google 图标
- [Twitter/X](https://x.com) - Twitter 图标
- [YouTube](https://youtube.com) - YouTube 图标
- [Stack Overflow](https://stackoverflow.com) - Stack Overflow 图标
- [NPM](https://npmjs.com) - NPM 图标

### 自定义图标

你可以通过 `{icon="图标名"}` 语法来自定义链接图标：

- [自定义图标链接](https://example.com){icon="tabler:color-swatch"}
- [另一个自定义图标](https://example.com){icon="ri:heart-fill"}

图标可以在 [Iconify](https://icon-sets.iconify.design/) 或 [Yesicon](https://yesicon.app/) 搜索。

### 外部链接特性

外部链接会自动添加以下特性：

1. **新标签页打开**：自动添加 `target="_blank"` 和 `rel="noopener noreferrer"`
2. **域名提示**：鼠标悬浮时会显示链接的域名
3. **外部链接标记**：链接右侧会显示一个小箭头图标

示例：[访问 Astro 官网](https://astro.build)

### 为更多站点匹配图标

你可以在 `src/plugins/prose-link-utils.mjs` 文件中添加更多的域名图标映射：

```javascript
const mainDomainIcons = {
  // 已有图标...
  'your-domain.com': 'icon-prefix:icon-name',
  // 添加更多...
};
```

### 技术栈图标支持

支持常见技术栈和平台的图标自动识别：

- [Vue.js](https://vuejs.org) - Vue 图标
- [React](https://react.dev) - React 图标
- [Tailwind CSS](https://tailwindcss.com) - Tailwind 图标
- [Node.js](https://nodejs.org) - Node.js 图标
- [Docker](https://docker.com) - Docker 图标
- [Vercel](https://vercel.com) - Vercel 图标
- [Netlify](https://netlify.com) - Netlify 图标

## 其他 Markdown 组件

:::note
这是一个提示（Note）。
:::

:::tip
这是一个建议（Tip）。
:::

:::warning
这是一个警告（Warning）。
:::

:::important
这是一个重要信息（Important）。
:::

:::caution
这是一个注意事项（Caution）。
:::

## Badge 徽章

Badge 组件支持多种样式，可以显示文本、图片，并支持自动获取外部站点图标和 GitHub 头像。

### 基本用法

**普通带链接**：:badge[普通带链接]{link="#badge"}

**纯文本指定圆形**：:badge[纯文本指定圆形]{round}

**纯文本指定方形**：:badge[纯文本指定方形]{square}

**带个图**：:badge[带个图]{img="https://picsum.photos/100/100"}

### 自动图标识别

外部域名自动获取站点图标 :badge[纸鹿]{link="https://www.zhilu.site"}，
:badge[古怪杂记本]{link="https://gug.thisis.host/" square}，
GitHub 链接能自动识别头像 :badge[KazariEX]{link="https://github.com/KazariEX"}，
也可指定方形 :badge[isYangs/GioPic]{square link="https://github.com/isYangs/GioPic"}。

### 在 Admonition 中使用

:::note
在其他组件中使用 :badge[带链接]{img="https://picsum.photos/100/100" text="带链接" link="#badge"}

:badge[指定圆形]{img="https://picsum.photos/100/100" text="指定圆形" round} 背景色 [可以 :badge[动态变化]{img="https://picsum.photos/100/100" text="动态变化" square} 使用](#badge)
:::

## BlogHeader 博客头部

BlogHeader 组件用于展示博客头部信息，支持 Logo、标题、副标题、背景 Emoji 动画等效果。鼠标悬浮时会触发字符动画。

### 基本用法

**完整版（带所有属性）**：

::blog-header{logo="/favicon/favicon.ico" title="喵洛阁" subtitle="KeMiao - Blog" link="/" emoji="📄,🦌,🙌,🐟,🏖️"}

**仅 Logo**：

::blog-header{logo="/favicon/favicon.ico" title="喵洛阁" showTitle="false"}

**无 Emoji 动画**：

::blog-header{logo="/favicon/favicon.ico" title="喵洛阁" subtitle="简约博客主题" link="/"}

**自定义 Emoji**：

::blog-header{logo="/favicon/favicon.ico" title="纸鹿摸鱼处" subtitle="纸鹿至麓不知路，支炉制露不止漉" link="https://www.zhilu.site" emoji="🦌,🐟,📖,✨,🍵"}

### 使用说明

BlogHeader 组件支持以下属性：

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `logo` | Logo 图片 URL | - |
| `title` | 博客标题 | - |
| `subtitle` | 博客副标题 | - |
| `link` | 点击跳转链接 | - |
| `emoji` | 背景 Emoji 动画，逗号分隔 | - |
| `showTitle` | 是否显示标题文字 | `true` |

鼠标悬浮时的动画 Emoji 对应标题的汉字，每个字符都有独立的动画延迟，营造出波浪般的视觉效果。

## 代码块

```javascript
// 普通代码块
console.log('Hello, World!');
```

```javascript [文件名示例.js]
// 带文件名的代码块
function greet(name) {
  return `Hello, ${name}!`;
}
```

## Chat 聊天对话

Chat 组件用于展示对话式的聊天内容，支持多种消息类型，模拟即时通讯软件的界面效果。

### 基本用法

使用 `:::chat` 包裹对话内容，通过特定的语法标记不同类型的消息：

- `((时间))` - 系统时间消息（居中显示）
- `((.))` - 自己发送的消息（右对齐，高亮背景）
- `((.名字))` - 带发送者名字的自己的消息
- `((系统消息))` - 系统通知（居中灰色显示，以特定关键词开头如"系统"）
- `((名字))` - 他人发送的消息（左对齐，默认背景）

### 完整示例

:::chat
((2024-11-09 23:39:30))

((.))

也许

((.))

我们可以聊聊天

((.纸鹿))

我还可以有名字

((纸鹿撤回了一条消息))

((用户1))

有趣\
我学到了。
:::

### 语法说明

```mdc
:::chat
((2024-11-09 23:39:30))  <- 系统时间，居中显示

((.))                      <- 自己的消息，右对齐

消息内容

((.纸鹿))                  <- 带名字的自己的消息

消息内容

((系统通知))              <- 系统消息，居中灰色

((对方名字))               <- 他人消息，左对齐

消息内容
:::
```

### 特性说明

1. **消息对齐**：自己的消息自动右对齐，他人消息左对齐
2. **视觉区分**：自己的消息使用主题色高亮背景，他人消息使用默认背景
3. **系统消息**：时间和通知类消息居中显示，使用较低透明度
4. **换行支持**：消息内容支持使用 `\` 进行手动换行
5. **响应式**：在移动端自动调整消息宽度和间距

## Key 按键

Key 组件用于展示键盘按键，支持单独按键、组合键和 macOS 风格图标显示。

### 基本用法

**纯 Code**：:key[Esc]{code="Escape"} :key[F2]{code="F2"} :key[Ctrl]{code="Control"} :key[A]{code="KeyA"} :key[Space]{code=" "} :key[Tab]{code="Tab"} :key[Enter]{code="Enter"}

**指定修饰符、图标、文本**（macOS 自动使用图标）：

:key[↑]{code="ArrowUp" icon} :key[⌥]{code="Alt" icon} :key[⇧]{code="Shift" icon} :key[空格]{code=" " icon} :key[⌫]{code="Backspace" icon} :key[↵]{code="Enter" icon}

### 组合键

**多修饰符组合**：:key{ctrl shift code="KeyA"} :key{shift alt} :key{cmd code="KeyS"}

**常用快捷键**：
- 复制：:key{ctrl code="KeyC"}
- 粘贴：:key{ctrl code="KeyV"}
- 保存：:key{ctrl code="KeyS"}
- 撤销：:key{ctrl code="KeyZ"}
- 全选：:key{ctrl code="KeyA"}

### 使用说明

Key 组件支持以下属性：

| 属性 | 说明 | 示例 |
|------|------|------|
| `code` | 按键代码，参考 [KeyboardEvent.key](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key) | `code="Enter"` |
| `text` | 自定义显示文本 | `text="自定义"` |
| `icon` | 使用 macOS 风格图标 | `icon` |
| `ctrl` | 显示 Ctrl 修饰符 | `ctrl` |
| `shift` | 显示 Shift 修饰符 | `shift` |
| `alt` | 显示 Alt 修饰符 | `alt` |
| `meta` | 显示 Meta (Cmd/Win) 修饰符 | `meta` |
| `cmd` | 智能适配：Windows 显示 Ctrl，macOS 显示 Cmd | `cmd` |

### 语法示例

```mdc
<!-- 单个按键 -->
:key[Esc]{code="Escape"}

<!-- 带图标的按键 -->
:key[↵]{code="Enter" icon}

<!-- 组合键 -->
:key{ctrl shift code="KeyA"}

<!-- 智能适配 cmd -->
:key{cmd code="KeyS"}
```

## LinkCard 链接卡片

LinkCard 组件用于展示简洁的链接卡片，左侧显示标题和描述，右侧显示图标。适用于文章内嵌链接、友情链接等场景。

### 基本用法

**完整版（带所有属性）**：

::link-card{title="纸鹿摸鱼处" description="纸鹿至麓不知路，支炉制露不止漉" link="https://www.zhilu.site" icon="https://www.zhilu.site/favicon.ico"}

**简洁版（自动识别图标）**：

::link-card{title="GitHub" link="https://github.com"}

::link-card{title="Vue.js 官方文档" link="https://vuejs.org"}

::link-card{title="哔哩哔哩" link="https://www.bilibili.com"}

**自定义描述**：

::link-card{title="Astro 官方文档" description="构建更快的内容驱动网站" link="https://astro.build"}

### 属性说明

LinkCard 组件支持以下属性：

| 属性 | 说明 | 必需 |
|------|------|------|
| `title` | 卡片标题 | 是 |
| `link` | 跳转链接 | 是 |
| `description` | 描述文本，不提供时自动使用链接域名 | 否 |
| `icon` | 自定义图标 URL，不提供时自动识别域名图标 | 否 |

### 自动图标识别

LinkCard 组件会根据链接的域名自动匹配对应的图标：

- GitHub 链接自动显示 GitHub 图标
- Bilibili 链接自动显示 Bilibili 图标
- Vue.js、React、Astro 等技术站点自动显示对应技术栈图标
- 更多支持的域名请参考 prose-link-utils.mjs 中的图标映射

### 外部链接特性

外部链接会自动添加以下特性：

1. **新标签页打开**：自动添加 `target="_blank"` 和 `rel="noopener noreferrer"`
2. **域名提取**：如果不提供 description，自动提取并显示链接的域名
3. **图标自动获取**：如果不提供 icon，自动根据域名获取对应图标

### 语法示例

```mdc
<!-- 完整用法 -->
::link-card{title="标题" description="描述" link="链接URL" icon="图标URL"}

<!-- 简洁用法（自动提取域名和图标） -->
::link-card{title="标题" link="链接URL"}

<!-- 自定义描述，自动图标 -->
::link-card{title="标题" description="自定义描述" link="链接URL"}

<!-- 自定义图标 -->
::link-card{title="标题" link="链接URL" icon="https://example.com/favicon.ico"}
```

### 响应式设计

LinkCard 组件支持响应式设计：

- **桌面端**：标准尺寸，图标 3rem
- **移动端**：紧凑布局，图标 2.5rem，字体稍小

---

## Pic 图片组件

Pic 组件用于展示图片，支持说明文字、点击缩放效果。适用于文章内展示图片并添加描述说明。

### 基本用法

**完整版（带所有属性）**：

::pic{src="https://picsum.photos/800/400?random=10" caption="说明文字，还支持通过 width 或 height 属性指定尺寸" alt="示例图片" width="600"}

**仅必需属性**：

::pic{src="https://picsum.photos/800/400?random=11"}

**带说明文字**：

::pic{src="https://picsum.photos/800/400?random=12" caption="这是一张美丽的风景图片"}

**禁用缩放效果**：

::pic{src="https://picsum.photos/800/400?random=13" caption="禁用缩放的图片" zoom="false"}

**指定尺寸**：

::pic{src="https://picsum.photos/800/400?random=14" caption="指定宽度为 400px" width="400"}

### 属性说明

Pic 组件支持以下属性：

| 属性 | 说明 | 必需 |
|------|------|------|
| `src` | 图片 URL | 是 |
| `alt` | 图片替代文本 | 否 |
| `caption` | 图片说明文字，显示在图片下方 | 否 |
| `width` | 图片宽度 | 否 |
| `height` | 图片高度 | 否 |
| `zoom` | 是否启用点击缩放效果，默认为 `true` | 否 |

### 特性说明

1. **自动缩放**：鼠标悬浮时图片会有轻微的放大效果（可通过 `zoom="false"` 禁用）
2. **说明文字**：支持通过 `caption` 属性添加图片说明，显示在图片下方居中位置
3. **响应式设计**：图片会自动适应容器宽度，在移动端显示更紧凑
4. **暗色模式适配**：暗色模式下图片会有适当的阴影效果

### 语法示例

```mdc
<!-- 完整用法 -->
::pic{src="图片URL" caption="说明文字" alt="替代文本" width="600"}

<!-- 简洁用法（仅图片） -->
::pic{src="图片URL"}

<!-- 带说明文字 -->
::pic{src="图片URL" caption="图片说明"}

<!-- 禁用缩放 -->
::pic{src="图片URL" zoom="false"}

<!-- 指定尺寸 -->
::pic{src="图片URL" width="400" height="300"}
```

### 响应式设计

Pic 组件支持响应式设计：

- **桌面端**：圆角 0.5rem，说明文字 0.875rem，悬浮有放大效果
- **移动端**：圆角 0.375rem，说明文字 0.8125rem，更紧凑的间距

---

## LinkBanner 链接横幅

LinkBanner 组件用于展示带有背景图片的链接卡片，适用于展示外部网站、文章推荐等场景。组件会自动提取链接域名作为默认描述。

### 基本用法

**完整版（带所有属性）**：

::link-banner{banner="https://picsum.photos/800/400?random=1" title="示例网站" description="这是一个示例描述文本" link="https://example.com"}

**仅必需属性**（描述自动显示为域名）：

::link-banner{banner="https://picsum.photos/800/400?random=2" title="GitHub 官网" link="https://github.com"}

**无背景图片**：

::link-banner{title="纯文本横幅" description="没有背景图片时的样式" link="https://example.com"}

### 属性说明

LinkBanner 组件支持以下属性：

| 属性 | 说明 | 必需 |
|------|------|------|
| `title` | 横幅标题 | 是 |
| `link` | 跳转链接 | 是 |
| `banner` | 背景图片 URL | 否 |
| `description` | 描述文本，不提供时自动使用链接域名 | 否 |

### 外部链接特性

外部链接会自动添加以下特性：

1. **新标签页打开**：自动添加 `target="_blank"` 和 `rel="noopener noreferrer"`
2. **域名提取**：如果不提供 description，自动提取并显示链接的域名

示例：

::link-banner{banner="https://picsum.photos/800/400?random=3" title="Astro 官方文档" link="https://astro.build"}

::link-banner{banner="https://picsum.photos/800/400?random=4" title="Vue.js 官方文档" description="渐进式 JavaScript 框架" link="https://vuejs.org"}

### 语法示例

```mdc
<!-- 完整用法 -->
::link-banner{banner="图片URL" title="标题" description="描述" link="链接URL"}

<!-- 简洁用法（自动提取域名） -->
::link-banner{banner="图片URL" title="标题" link="链接URL"}

<!-- 无背景图片 -->
::link-banner{title="标题" description="描述" link="链接URL"}
```

### 响应式设计

LinkBanner 组件支持响应式设计：

- **桌面端**：最大宽度 600px，宽高比 2.4:1
- **平板端**：最大宽度 500px
- **移动端**：全宽显示，宽高比 2:1，更紧凑的间距
