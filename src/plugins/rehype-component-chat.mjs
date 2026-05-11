/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Chat component for displaying conversation-style messages.
 *
 * Syntax:
 * :::chat
 * ((2024-11-09 23:39:30))  - System time message
 * ((.))                      - My message (right side)
 * ((.Name))                  - My message with name
 * ((System message))         - System notification (center)
 * ((Name))                   - Others' message (left side)
 * Message content here
 * :::
 *
 * @param {Object} properties - The properties of the component.
 * @param {import('mdast').RootContent[]} children - The children elements.
 * @returns {import('mdast').Parent} The created Chat component.
 */
export function ChatComponent(properties, children) {
  if (!Array.isArray(children) || children.length === 0) {
    return h("div", { class: "hidden" }, "Chat component requires content.");
  }

  // Match patterns like ((.)), ((.name)), ((system)), ((name))
  const chatRegex = /^\(\((?<control>\.)?(?<caption>[^)]*)\)\)$/;

  // Keywords that indicate a system message
  const systemKeywords = ['撤回', '系统', '通知', '公告', '提示'];

  /**
   * Get control class based on control character or content
   * @param {string|undefined} control
   * @param {string} caption
   * @returns {string}
   */
  function getControlClass(control, caption) {
    if (control === ".") return "chat-myself";
    // Check if caption contains system keywords
    if (systemKeywords.some(keyword => caption.includes(keyword))) return "chat-system";
    return "";
  }

  /**
   * Extract text content from a hast node recursively
   * @param {any} node
   * @returns {string}
   */
  function extractTextContent(node) {
    if (!node) return "";
    if (node.type === "text") return node.value || "";
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractTextContent).join("");
    }
    return "";
  }

  /**
   * Check if a node represents a chat caption directive
   * @param {any} node
   * @returns {{isCaption: boolean, control?: string, caption?: string} | null}
   */
  function parseCaptionNode(node) {
    if (node.type !== "element") return null;

    const tagName = node.tagName || "";

    // Case 1: Paragraph with text content matching the pattern
    if (tagName === "p") {
      const textContent = extractTextContent(node);
      const trimmedContent = textContent.trim();
      const match = trimmedContent.match(chatRegex);

      if (match) {
        return {
          isCaption: true,
          control: match.groups.control,
          caption: match.groups.caption,
        };
      }
    }

    return null;
  }

  /**
   * Process children to extract chat items
   * @returns {Array<{type: 'caption'|'body', content: any, className?: string}>}
   */
  function processChatItems() {
    const items = [];
    let currentBodyContent = [];

    /**
     * Flush accumulated body content as an item
     */
    function flushBody() {
      if (currentBodyContent.length > 0) {
        items.push({
          type: "body",
          content: [...currentBodyContent],
        });
        currentBodyContent = [];
      }
    }

    // Process all children
    for (const child of children) {
      const captionInfo = parseCaptionNode(child);

      if (captionInfo && captionInfo.isCaption) {
        // This is a caption
        flushBody();
        items.push({
          type: "caption",
          content: captionInfo.caption,
          className: getControlClass(captionInfo.control, captionInfo.caption),
        });
      } else if (child.type === "element") {
        // This is body content
        currentBodyContent.push(child);
      }
    }

    // Flush remaining body content
    flushBody();

    return items;
  }

  const chatItems = processChatItems();
  const dlChildren = [];

  for (const item of chatItems) {
    if (item.type === "caption") {
      dlChildren.push(
        h("dt", { class: ["chat-caption", item.className].filter(Boolean).join(" ") }, item.content)
      );
    } else {
      dlChildren.push(h("dd", { class: "chat-body" }, item.content));
    }
  }

  return h("dl", { class: "chat" }, dlChildren);
}
