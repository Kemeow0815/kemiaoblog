/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * 创建一个诗词展示组件 (Poetry Component)
 * 支持 title(标题), author(作者), footer(落款) 属性
 * @param {Object} properties - 节点属性
 * @param {string} [properties.title] - 诗词标题
 * @param {string} [properties.author] - 作者名称
 * @param {string} [properties.footer] - 可选落款
 * @param {import('mdast').RootContent[]} children - 诗词内容
 * @returns {import('hast').Element}
 */
export function PoetryComponent(properties, children) {
  if (!Array.isArray(children) || children.length === 0) {
    return h("div", { class: "hidden" }, "Invalid poetry content");
  }

  const title = properties?.title || "";
  const author = properties?.author || "";
  const footer = properties?.footer || "";

  // 处理内容，保留换行和段落结构
  const processNodes = (nodes) => {
    return nodes.flatMap((node) => {
      if (node.type !== "element") return node;
      if (node.tagName === "p") {
        // 将段落转换为 poetry-line
        return h("div", { class: "poetry-line" }, node.children || []);
      }
      return {
        ...node,
        children: processNodes(node.children || []),
      };
    });
  };

  const processedChildren = processNodes(children);

  // 构建组件结构
  const poetryChildren = [];

  // 标题
  if (title) {
    poetryChildren.push(h("h2", { class: "poetry-title" }, title));
  }

  // 作者
  if (author) {
    poetryChildren.push(h("div", { class: "poetry-author" }, author));
  }

  // 内容区域
  poetryChildren.push(h("div", { class: "poetry-content" }, processedChildren));

  // 落款
  if (footer) {
    poetryChildren.push(h("div", { class: "poetry-footer" }, footer));
  }

  return h("section", { class: "poetry" }, poetryChildren);
}
