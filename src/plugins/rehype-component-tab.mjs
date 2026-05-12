/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Tab 组件 - 实现选项卡切换功能
 *
 * 语法：
 * :::tab{tabs="Tab1,Tab2,Tab3"}
 * #tab1
 * Tab1 的内容
 * #tab2
 * Tab2 的内容
 * #tab3
 * Tab3 的内容
 * :::
 *
 * @param {Object} properties - 组件属性
 * @param {string} [properties.tabs] - Tab 标签，逗号分隔的字符串
 * @param {boolean} [properties.center] - 是否居中显示
 * @param {string|number} [properties.active] - 默认激活的 Tab 索引（从1开始）
 * @param {import('mdast').RootContent[]} children - 子元素
 * @returns {import('hast').Element}
 */
export function TabComponent(properties, children) {
  if (!Array.isArray(children) || children.length === 0) {
    return h("div", { class: "hidden" }, "Tab 组件需要内容。");
  }

  // 解析 tabs 属性 - 支持逗号分隔的字符串
  let tabs = [];
  if (properties?.tabs) {
    const tabsStr = String(properties.tabs).trim();
    // 尝试解析为 JSON 数组
    if (tabsStr.startsWith("[") && tabsStr.endsWith("]")) {
      try {
        tabs = JSON.parse(tabsStr);
      } catch {
        // JSON 解析失败，回退到逗号分割
        tabs = tabsStr
          .slice(1, -1)
          .split(",")
          .map((t) => t.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      }
    } else {
      // 直接按逗号分割
      tabs = tabsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  // 如果没有 tabs 属性，返回错误提示
  if (tabs.length === 0) {
    return h(
      "div",
      { class: "hidden" },
      'Tab 组件需要 tabs 属性，例如：:::tab{tabs="Tab1,Tab2,Tab3"}',
    );
  }

  // 解析其他属性
  const center = properties?.center === true || properties?.center === "true";
  const activeTab = Math.max(1, parseInt(properties?.active) || 1);

  // 提取文本内容的辅助函数
  function extractTextContent(node) {
    if (!node) return "";
    if (node.type === "text") return node.value || "";
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractTextContent).join("");
    }
    return "";
  }

  // 检查节点是否是 #tabN 标记
  function isTabMarkerNode(node) {
    if (!node) return { isMarker: false, tabNum: 0 };

    // 检查 element 类型的节点
    if (node.type === "element") {
      const text = extractTextContent(node).trim();
      const match = text.match(/^#tab(\d+)$/);
      if (match) {
        return { isMarker: true, tabNum: parseInt(match[1]) };
      }
    }

    // 检查 text 类型的节点
    if (node.type === "text") {
      const text = node.value?.trim() || "";
      const match = text.match(/^#tab(\d+)$/);
      if (match) {
        return { isMarker: true, tabNum: parseInt(match[1]) };
      }
    }

    return { isMarker: false, tabNum: 0 };
  }

  // 处理子元素，提取 #tabN 标记的内容
  const tabContents = [];
  let currentTabIndex = 0;
  let currentContent = [];

  for (const child of children) {
    const { isMarker, tabNum } = isTabMarkerNode(child);

    if (isMarker && tabNum > 0) {
      // 保存之前的内容
      if (currentTabIndex > 0 && currentContent.length > 0) {
        tabContents[currentTabIndex - 1] = [...currentContent];
      }
      // 开始新的 tab
      currentTabIndex = tabNum;
      currentContent = [];
    } else if (currentTabIndex > 0) {
      // 添加到当前内容
      currentContent.push(child);
    }
  }

  // 保存最后一个 tab 的内容
  if (currentTabIndex > 0 && currentContent.length > 0) {
    tabContents[currentTabIndex - 1] = [...currentContent];
  }

  // 确保每个 tab 都有内容（即使是空的）
  for (let i = 0; i < tabs.length; i++) {
    if (!tabContents[i]) {
      tabContents[i] = [];
    }
  }

  // 生成唯一的组件 ID
  const componentId = `tab-${Math.random().toString(36).substring(2, 9)}`;

  // 构建 tabs 按钮
  const tabButtons = tabs.map((tab, index) => {
    const tabNum = index + 1;
    const isActive = tabNum === activeTab;
    return h(
      "button",
      {
        type: "button",
        class: `tab-button ${isActive ? "active" : ""}`,
        "data-tab": String(tabNum),
        "data-target": `${componentId}-content-${tabNum}`,
        onclick: `switchTab('${componentId}', ${tabNum})`,
      },
      tab,
    );
  });

  // 构建 tab 内容区域
  const tabPanels = tabs.map((tab, index) => {
    const tabNum = index + 1;
    const isActive = tabNum === activeTab;
    const content = tabContents[index] || [];

    return h(
      "div",
      {
        id: `${componentId}-content-${tabNum}`,
        class: `tab-panel ${isActive ? "active" : ""}`,
        "data-tab": String(tabNum),
        style: isActive ? "" : "display: none;",
      },
      content,
    );
  });

  // 构建完整的 Tab 组件
  const tabContainer = h(
    "div",
    {
      class: `tab-container ${center ? "center" : ""}`,
      id: componentId,
      "data-active": String(activeTab),
    },
    [
      h("div", { class: "tab-buttons" }, tabButtons),
      h("div", { class: "tab-panels" }, tabPanels),
    ],
  );

  return tabContainer;
}
