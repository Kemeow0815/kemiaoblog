import { visit } from "unist-util-visit";
import { getDomainIcon, isExtLink, getDomain } from "./prose-link-utils.mjs";

/**
  * ProseLink 插件 - 增强 Markdown 链接
 * 
 * 功能：
 * 1. 外部链接自动添加 target="_blank" 和 rel="noopener noreferrer"
 * 2. 根据域名自动匹配图标
 * 3. 支持通过 {icon="icon-name"} 语法自定义图标
 * 4. 鼠标悬浮时显示域名提示
 * 
 * 使用方法：
 * - [普通链接](https://example.com) - 自动识别外部链接并添加图标
 * - [自定义图标](https://example.com){icon="tabler:color-swatch"} - 指定图标
 * - [内部链接](#anchor) - 不添加外部链接属性
 */
export function proseLinkPlugin() {
  return (tree) => {
    visit(tree, { type: "element", tagName: "a" }, (node) => {
      const href = node.properties?.href || "";
      
      // 跳过没有 href 的链接
      if (!href) return;

      // 检查是否是外部链接
      const isExternal = isExtLink(href);
      
      // 获取域名
      const domain = isExternal ? getDomain(href) : "";
      
      // 获取图标（优先从父元素的属性中获取自定义图标）
      let icon = node.properties?.icon;
      
      // 如果没有自定义图标，则根据域名自动匹配
      if (!icon && isExternal) {
        icon = getDomainIcon(href);
      }
      
      // 构建增强的链接结构
      const enhancedNode = {
        type: "element",
        tagName: "a",
        properties: {
          ...node.properties,
          href: href,
          className: [
            "prose-link",
            isExternal ? "prose-link-external" : "prose-link-internal",
            ...(node.properties?.className || []),
          ],
          // 外部链接添加 target 和 rel
          ...(isExternal && {
            target: "_blank",
            rel: "noopener noreferrer",
          }),
          // 添加 data-domain 属性用于 tooltip
          ...(domain && { "data-domain": domain }),
          // 添加 data-icon 属性用于客户端渲染图标
          ...(icon && { "data-icon": icon }),
        },
        children: [],
      };

      // 如果有图标，添加图标占位元素
      if (icon && typeof icon === 'string') {
        const iconSpan = {
          type: "element",
          tagName: "span",
          properties: {
            className: ["prose-link-icon"],
            "data-icon": icon,
          },
          children: [],
        };
        enhancedNode.children.push(iconSpan);
      }

      // 添加链接文本
      if (node.children && node.children.length > 0) {
        enhancedNode.children.push(...node.children);
      }

      // 外部链接添加外部链接指示器
      if (isExternal) {
        const externalIndicator = {
          type: "element",
          tagName: "span",
          properties: {
            className: ["prose-link-external-indicator"],
            "aria-hidden": "true",
          },
          children: [],
        };
        enhancedNode.children.push(externalIndicator);
      }

      // 替换原节点
      Object.assign(node, enhancedNode);
    });
  };
}
