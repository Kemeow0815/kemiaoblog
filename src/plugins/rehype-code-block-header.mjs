import { visit } from 'unist-util-visit';

/**
 * 为代码块添加文件名头部
 * 从 frontmatter 的 filenames 字段获取文件名（空格分隔多个文件名）
 */
export function codeBlockHeaderPlugin() {
  return (tree, file) => {
    // 从 frontmatter 获取 filenames
    const filenames = file.data?.astro?.frontmatter?.filenames;
    const filenameList = filenames ? filenames.split(/\s+/).filter(Boolean) : [];
    let filenameIndex = 0;

    visit(tree, { type: 'element', tagName: 'pre' }, (node, index, parent) => {
      // 获取代码元素
      const codeNode = node.children?.find(child => child.type === 'element' && child.tagName === 'code');
      if (!codeNode) return;

      // 获取文件名
      let filename = '';
      if (filenameIndex < filenameList.length) {
        filename = filenameList[filenameIndex];
        filenameIndex++;
      }

      // 如果没有文件名，直接返回
      if (!filename) return;

      // 创建文件名头部
      const header = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block-header'] },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['code-block-filename'] },
            children: [
              {
                type: 'element',
                tagName: 'svg',
                properties: {
                  className: ['file-icon'],
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: '2',
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'path',
                    properties: {
                      d: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z',
                    },
                  },
                  {
                    type: 'element',
                    tagName: 'polyline',
                    properties: {
                      points: '13 2 13 9 20 9',
                    },
                  },
                ],
              },
              { type: 'text', value: filename },
            ],
          },
        ],
      };

      // 创建包装容器
      const wrapper = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block-wrapper'] },
        children: [header, node],
      };

      // 用包装容器替换原有的 pre
      parent.children[index] = wrapper;
    });
  };
}
