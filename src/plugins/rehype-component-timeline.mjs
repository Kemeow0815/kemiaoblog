/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Timeline 时间线组件
 *
 * 语法：
 * ::timeline
 * {前天}
 *
 * 看到了小兔
 *
 * {昨天}
 *
 * 是小鹿
 *
 * {今天}
 *
 * 是你。
 * ::
 *
 * @param {Object} properties - 组件属性（暂无特殊属性）
 * @param {import('mdast').RootContent[]} children - 子元素
 * @returns {import('hast').Element}
 */
export function TimelineComponent(properties, children) {
  if (!Array.isArray(children) || children.length === 0) {
    return h("div", { class: "hidden" }, "Timeline 组件需要内容。");
  }

  const timelineRegex = /^\{(?<caption>.*)\}$/;

  // 提取文本内容的辅助函数
  function extractTextContent(node) {
    if (!node) return "";
    if (node.type === "text") return node.value || "";
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractTextContent).join("");
    }
    return "";
  }

  // 检查节点是否是时间线标题标记 {caption}
  function isTimelineCaptionNode(node) {
    if (!node) return { isCaption: false, caption: "" };

    const text = extractTextContent(node).trim();
    const match = text.match(timelineRegex);
    if (match && match.groups) {
      return { isCaption: true, caption: match.groups.caption };
    }

    return { isCaption: false, caption: "" };
  }

  // 处理子元素，提取时间线项
  const timelineItems = [];
  let currentCaption = "";
  let currentBodyContent = [];

  for (const child of children) {
    const { isCaption, caption } = isTimelineCaptionNode(child);

    if (isCaption) {
      // 保存之前的内容
      if (currentCaption || currentBodyContent.length > 0) {
        timelineItems.push({
          caption: currentCaption,
          content: [...currentBodyContent],
        });
      }
      // 开始新的时间线项
      currentCaption = caption;
      currentBodyContent = [];
    } else {
      // 过滤掉纯空白内容的节点
      const text = extractTextContent(child).trim();
      if (text || (child.type === "element" && child.tagName)) {
        currentBodyContent.push(child);
      }
    }
  }

  // 保存最后一个时间线项
  if (currentCaption || currentBodyContent.length > 0) {
    timelineItems.push({
      caption: currentCaption,
      content: [...currentBodyContent],
    });
  }

  // 如果没有有效的时间线项，返回提示
  if (timelineItems.length === 0) {
    return h(
      "div",
      { class: "timeline-empty" },
      "Timeline 组件需要至少一个时间标记，例如：{今天}",
    );
  }

  // 构建时间线项
  const timelineElements = timelineItems.map((item) => {
    const itemChildren = [];

    // 标题 (dt)
    if (item.caption) {
      itemChildren.push(h("dt", { class: "timeline-caption" }, item.caption));
    }

    // 内容 (dd) - 如果有内容的话
    if (item.content && item.content.length > 0) {
      itemChildren.push(h("dd", { class: "timeline-body card" }, item.content));
    }

    return itemChildren;
  });

  // 扁平化数组
  const flatElements = timelineElements.flat();

  // 构建完整的时间线组件
  return h("dl", { class: "timeline" }, flatElements);
}
