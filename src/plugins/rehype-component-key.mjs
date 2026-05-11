/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * 按键显示映射
 * @type {Record<string, string>}
 */
const displayMap = {
  " ": "Space",
  "ArrowDown": "↓",
  "ArrowLeft": "←",
  "ArrowRight": "→",
  "ArrowUp": "↑",
  "Control": "Ctrl",
  "Delete": "Del",
  "Escape": "Esc",
  "Meta": "Cmd",
};

/**
 * 符号映射（macOS 风格）
 * @type {Record<string, string>}
 */
const symbolMap = {
  " ": "␣",
  "Alt": "⌥",
  "Backspace": "⌫",
  "Control": "⌃",
  "Delete": "⌦",
  "Enter": "↵",
  "Escape": "⎋",
  "Meta": "⌘",
  "Shift": "⇧",
  "Tab": "⇥",
  "Win": "⊞",
};

/**
 * 获取按键显示文本
 * @param {string} code - 按键代码
 * @param {boolean} useSymbol - 是否使用符号
 * @returns {string} - 显示文本
 */
function getKeyDisplay(code, useSymbol) {
  if (!code) return "";
  if (useSymbol && symbolMap[code]) {
    return symbolMap[code];
  }
  if (displayMap[code]) {
    return displayMap[code];
  }
  return code;
}

/**
 * 创建 Key 组件
 *
 * @param {Object} properties - 组件属性
 * @param {string} [properties.text] - 自定义显示文本
 * @param {string} [properties.code] - 按键代码 (https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key)
 * @param {boolean} [properties.icon] - 是否使用图标（macOS 风格）
 * @param {boolean} [properties.ctrl] - 是否显示 Ctrl
 * @param {boolean} [properties.shift] - 是否显示 Shift
 * @param {boolean} [properties.alt] - 是否显示 Alt
 * @param {boolean} [properties.meta] - 是否显示 Meta (Cmd/Win)
 * @param {boolean} [properties.win] - 是否显示 Win
 * @param {boolean} [properties.cmd] - 智能适配：Windows用Ctrl，macOS用Cmd
 * @param {import('mdast').RootContent[]} children - 子元素
 * @returns {import('mdast').Parent} - 创建的 Key 组件
 */
export function KeyComponent(properties, children) {
  // 提取文本内容
  let text = properties.text || "";
  if (!text && Array.isArray(children) && children.length > 0) {
    const extractText = (nodes) => {
      return nodes
        .map((node) => {
          if (node.type === "text") return node.value;
          if (node.type === "element" && node.children)
            return extractText(node.children);
          return "";
        })
        .join("");
    };
    text = extractText(children).trim();
  }

  const code = properties.code || "";
  const useIcon = properties.icon !== undefined;
  const hasCtrl = properties.ctrl !== undefined;
  const hasShift = properties.shift !== undefined;
  const hasAlt = properties.alt !== undefined;
  const hasMeta = properties.meta !== undefined;
  const hasWin = properties.win !== undefined;
  const hasCmd = properties.cmd !== undefined;

  // 构建按键列表
  const keys = [];

  // 智能适配 cmd：Windows用Ctrl，macOS用Cmd
  if (hasCmd) {
    keys.push({ type: "cmd" });
  }

  // 单独的修饰键
  if (hasCtrl && !hasCmd) {
    keys.push({ code: "Control", type: "modifier" });
  }
  if (hasShift) {
    keys.push({ code: "Shift", type: "modifier" });
  }
  if (hasAlt) {
    keys.push({ code: "Alt", type: "modifier" });
  }
  if (hasMeta && !hasCmd) {
    keys.push({ code: "Meta", type: "modifier" });
  }
  if (hasWin && !hasMeta) {
    keys.push({ code: "Win", type: "modifier" });
  }

  // 主按键
  if (code) {
    keys.push({ code, type: "key" });
  } else if (text && keys.length === 0) {
    // 只有文本，没有修饰键和code
    keys.push({ text, type: "text" });
  }

  // 如果没有指定任何内容，使用文本作为显示
  if (keys.length === 0 && text) {
    keys.push({ text, type: "text" });
  }

  // 构建子元素
  const keyChildren = [];

  keys.forEach((key, index) => {
    let displayText = "";

    if (key.type === "cmd") {
      // cmd 智能适配，显示为图标
      displayText = "⌘/Ctrl";
    } else if (key.type === "modifier") {
      displayText = getKeyDisplay(key.code, useIcon);
    } else if (key.type === "key") {
      displayText = getKeyDisplay(key.code, useIcon);
    } else if (key.type === "text") {
      displayText = key.text;
    }

    if (displayText) {
      keyChildren.push(
        h("span", { class: "key-item" }, displayText)
      );

      // 添加分隔符（如果不是最后一个）
      if (index < keys.length - 1) {
        keyChildren.push(
          h("span", { class: "key-separator" }, "+")
        );
      }
    }
  });

  // 构建 class
  const classNames = ["key-component"];
  if (useIcon) classNames.push("with-icon");

  // 构建 data 属性用于 JavaScript 交互
  const dataAttrs = {};
  if (code) dataAttrs["data-code"] = code;
  if (hasCtrl) dataAttrs["data-ctrl"] = "true";
  if (hasShift) dataAttrs["data-shift"] = "true";
  if (hasAlt) dataAttrs["data-alt"] = "true";
  if (hasMeta) dataAttrs["data-meta"] = "true";
  if (hasWin) dataAttrs["data-win"] = "true";
  if (hasCmd) dataAttrs["data-cmd"] = "true";

  return h(
    "kbd",
    {
      class: classNames.join(" "),
      ...dataAttrs,
    },
    keyChildren.length > 0 ? keyChildren : [text || code || ""]
  );
}
