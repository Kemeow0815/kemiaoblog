---
title: "博客功能完整测试"
pubDate: 2026-05-10
description: "喵洛阁博客所有功能的完整测试文档"
image: "https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/markdown-guide.webp"
draft: false
slugId: markdown-guide
category: "测试"
toc: true
summary: "本文档是关于喵洛阁博客功能测试的总结，涵盖了Markdown基础语法、Alert提示框、数学公式、特殊样式和卡片组件等，文章还提供了渲染效果的描述，包括段落之间空行分隔、使用1-6个井号表示标题、粗体、斜体、删除线、无序列表和有序列表的格式，以及任务清单的展示方式，此外，还提到了引用文本、嵌套引用和代码示例的使用。"
---
# 博客功能完整测试

本文档整合了喵洛阁博客的所有功能测试，包括 Markdown 基础语法、Alert 提示框、数学公式、特殊样式、卡片组件等。

---

## 一、Markdown 基础语法

### 1.1 标题

使用 1-6 个井号 `#` 表示标题：

```markdown
# 这是一级标题
## 这是二级标题
### 这是三级标题
#### 这是四级标题
##### 这是五级标题
###### 这是六级标题
```

渲染效果：

# 这是一级标题
## 这是二级标题
### 这是三级标题
#### 这是四级标题
##### 这是五级标题
###### 这是六级标题

---

### 1.2 段落与换行

段落之间用空行分隔：

```markdown
这是第一段。

这是第二段。
```

在行尾添加两个空格表示换行：

```markdown
这是第一行  
这是第二行
```

---

### 1.3 文本样式

**粗体**：使用 `**文本**` 或 `__文本__`

*斜体*：使用 `*文本*` 或 `_文本_`

***粗斜体***：使用 `***文本***`

~~删除线~~：使用 `~~文本~~`

`行内代码`：使用 `` `代码` ``

---

### 1.4 列表

**无序列表**：

```markdown
- 第一项
- 第二项
  - 嵌套项 A
  - 嵌套项 B
```

渲染效果：

- 第一项
- 第二项
  - 嵌套项 A
  - 嵌套项 B

**有序列表**：

```markdown
1. 第一项
2. 第二项
   1. 嵌套项 A
   2. 嵌套项 B
```

渲染效果：

1. 第一项
2. 第二项
   1. 嵌套项 A
   2. 嵌套项 B

**任务清单**：

```markdown
- [x] 已完成任务
- [ ] 未完成任务
- [ ] 另一个未完成任务
```

渲染效果：

- [x] 已完成任务
- [ ] 未完成任务
- [ ] 另一个未完成任务

---

### 1.5 引用

使用 `>` 表示引用：

```markdown
> 这是一段引用文本。
> 可以包含多行。
```

渲染效果：

> 这是一段引用文本。
> 可以包含多行。

**嵌套引用**：

```markdown
> 外层引用
>
> > 内层引用
```

渲染效果：

> 外层引用
>
> > 内层引用

---

### 1.6 代码块

使用三个反引号包裹代码，并指定语言：

````markdown
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet('World'));
```
````

渲染效果：

```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet('World'));
```

---

### 1.7 表格

```markdown
| 水果   | 颜色 | 口感 |
| ------ | ---- | ---- |
| 西瓜🍉 | 绿色 | 甜   |
| 葡萄🍇 | 紫色 | 酸   |
```

渲染效果：

| 水果   | 颜色 | 口感 |
| ------ | ---- | ---- |
| 西瓜🍉 | 绿色 | 甜   |
| 葡萄🍇 | 紫色 | 酸   |

**对齐方式**：

```markdown
| 左对齐 | 居中  | 右对齐 |
| :----- | :---: | -----: |
| 内容   | 内容  |   内容 |
```

渲染效果：

| 左对齐 | 居中  | 右对齐 |
| :----- | :---: | -----: |
| 内容   | 内容  |   内容 |

---

### 1.8 链接与图片

**链接**：

```markdown
[链接文本](https://example.com)
[带标题的链接](https://example.com "标题")
```

渲染效果：

[链接文本](https://example.com)

**图片**：

```markdown
![图片描述](https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/bg.webp)
![带标题的图片](https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/bg.webp "这是标题")
```

渲染效果：

![博客图标](https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/bg.webp)

---

### 1.9 水平线

使用三个或更多星号、减号或下划线：

```markdown
---
***
___
```

渲染效果：

---

---

## 二、Alert 提示框

### 2.1 基础类型

:::note
这是一个提示（Note）。
:::

:::tip
这是一个建议（Tip）。
:::

:::important
这是一个重要事项（Important）。
:::

:::warning
这是一个警告（Warning）。
:::

:::caution
这是一个危险事项（Caution）。
:::

### 2.2 多行内容

:::tip
这是一个包含多行内容的提示框。

- 支持列表项
- 可以包含多个段落

**重点内容**：还可以包含粗体文字和其他 Markdown 元素。
:::

### 2.3 嵌套代码块

:::warning
提示框内可以包含代码块等其他元素。

```javascript
console.log('Hello from alert box!');
```
:::

### 2.4 自定义标题

:::important[自定义标题]
这是一个带有自定义标题的提示框。标题会显示为"自定义标题"而不是默认的"IMPORTANT"。
:::

---

## 三、数学公式（KaTeX）

### 3.1 行内公式

使用 `$公式$` 表示行内公式：

爱因斯坦质能方程：$E = mc^2$

求和公式：$\sum_{i=1}^{n} x_i = X$

### 3.2 块级公式

使用 `$$公式$$` 表示块级公式：

薛定谔方程：

$$
\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \frac{i}{\hbar}H\Psi(\mathbf{r},t)
$$

### 3.3 复杂公式

麦克斯韦方程组：

$$
\begin{aligned}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} & = \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} & = 0
\end{aligned}
$$

### 3.4 矩阵

$$
\begin{pmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{pmatrix}
$$

### 3.5 分段函数

$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$

### 3.6 极限与积分

极限：

$$
\lim_{x \to 0} \frac{\sin(x)}{x} = 1
$$

高斯积分：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

---

## 四、特殊样式

### 4.1 模糊效果

这是一个!!模糊!!效果。

对于桌面端，鼠标移入时会移除模糊效果，点击后会保持3秒清晰显示；对于移动设备，点击后移除模糊效果，当同时满足点击后超过3秒和页面滑动才会变为模糊状态。

### 4.2 拼音标注

{拼音}(pīn|yīn)

{君の名は}(きみ||な|)

### 4.3 彩虹文字

这是一个==彩虹==文字效果。

### 4.4 下划线

这个文字下面有++下划线++效果。

### 4.5 嵌套效果

上面的样式可以进行嵌套：

这是一个!!==模糊并且带{拼音}(pīn|yīn)的{彩虹}(cǎi|hóng)==!!

---

## 五、卡片组件

### 5.1 音乐卡片

::music{id="30431366"}

### 5.2 GitHub 卡片

::github{repo="Motues/Momo"}

---

## 六、引用块

:::quote

宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼。

<right>——《三体 II：黑暗森林》</right>

:::

:::quote
$E = mc^2$
:::

---

## 七、视频嵌入

使用 `<iframe>` 标签插入视频：

```html
<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=112823891921963&bvid=BV1n281ePEd9&cid=500001622491427&p=1" 
        scrolling="no" 
        frameborder="no" 
        framespacing="0" 
        allowfullscreen="true" 
        width="100%" 
        height="468">
</iframe>
```

---

## 八、Typst 渲染

基于 [Typst.ts](https://myriad-dreamin.github.io/typst.ts/) 实现的 Typst 渲染。

```typst
#set page(width: auto, height: auto, margin: 10pt)
#set text(fill: rgb("#2f61eb"), size: 20pt)

$ cal(A) = pi r^2 $

Hello from *Typst*!
```

复杂示例（Waves）：

```typst *Waves*
#import "@preview/cetz:0.4.2": canvas, draw

#set page(width: auto, height: auto, margin: .5cm)

#canvas({
  import draw: *
  ortho(y: -30deg, x: 30deg, {
    on-xz({
      grid((0,-2), (8,2), stroke: gray + .5pt)
    })
    on-xy({
      line(..(for x in range(0, 101) {
        let x = x / 100
        ((x * 8, calc.sin(x * 4 * calc.pi) * 1.6),)
      }), fill: rgb(84, 219, 219, 80))
    })
  })
})
```

---

## 九、目录测试

### 9.1 一级标题

#### 9.1.1 二级标题 A

#### 9.1.2 二级标题 B

### 9.2 另一个一级标题

#### 9.2.1 二级标题

##### 9.2.1.1 三级标题

##### 9.2.1.2 另一个三级标题

---

## 十、总结

本文档测试了喵洛阁博客的所有核心功能：

1. ✅ Markdown 基础语法
2. ✅ Alert 提示框组件
3. ✅ KaTeX 数学公式
4. ✅ 特殊文本样式（模糊、拼音、彩虹、下划线）
5. ✅ 卡片组件（音乐、GitHub）
6. ✅ 引用块
7. ✅ 视频嵌入
8. ✅ Typst 渲染
9. ✅ 目录生成

---

> 💡 **提示**: 更多功能详情请参考 [Wiki 文档](/wiki/)
