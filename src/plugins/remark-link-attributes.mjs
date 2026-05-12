import { visit } from "unist-util-visit";

/**
 * Remark 插件 - 解析链接后的自定义属性语法
 * 
 * 支持语法：[链接文本](链接地址){icon=图标名}
 * 将 {icon=...} 解析为链接节点的属性
 * 使用 @ 代替 : 来避免 Markdown 解析问题
 */
export function remarkLinkAttributes() {
  return (tree) => {
    visit(tree, "paragraph", (node) => {
      if (!node.children) return;

      // 遍历段落中的所有子节点
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        
        // 检查是否是链接节点
        if (child.type === "link") {
          // 检查下一个节点是否是文本节点，且包含 {icon=...} 语法
          const nextNode = node.children[i + 1];
          if (nextNode && nextNode.type === "text") {
            // 匹配 {icon=图标名} 语法，图标名中不能包含空格
            const match = nextNode.value.match(/^\{icon=([^}\s]+)\}/);
            if (match) {
              // 提取图标名称，并将 @ 替换回 :
              const iconName = match[1].replace(/@/g, ':');
              
              // 将图标属性添加到链接节点
              child.data = child.data || {};
              child.data.hProperties = child.data.hProperties || {};
              child.data.hProperties.icon = iconName;
              
              // 从文本节点中移除已解析的部分
              nextNode.value = nextNode.value.slice(match[0].length);
              
              // 如果文本节点为空，移除它
              if (nextNode.value === "") {
                node.children.splice(i + 1, 1);
              }
            }
          }
        }
      }
    });
  };
}
