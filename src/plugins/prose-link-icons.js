/**
 * ProseLink 图标渲染脚本
 * 使用 Iconify API 动态加载和渲染图标
 */

(function() {
  // Iconify API 基础 URL
  const ICONIFY_API = 'https://api.iconify.design';
  
  // 缓存已加载的图标
  const iconCache = new Map();
  
  /**
   * 获取图标 SVG
   * @param {string} iconName - 图标名称，如 "ri:github-fill"
   * @returns {Promise<string>} - SVG 字符串
   */
  async function fetchIcon(iconName) {
    if (iconCache.has(iconName)) {
      return iconCache.get(iconName);
    }
    
    const [prefix, name] = iconName.split(':');
    if (!prefix || !name) return null;
    
    try {
      const response = await fetch(`${ICONIFY_API}/${prefix}/${name}.svg`);
      if (!response.ok) return null;
      
      const svg = await response.text();
      iconCache.set(iconName, svg);
      return svg;
    } catch (error) {
      console.error('[ProseLink] Failed to fetch icon:', iconName, error);
      return null;
    }
  }
  
  /**
   * 渲染所有图标
   */
  async function renderIcons() {
    const iconElements = document.querySelectorAll('.prose-link-icon[data-icon]');
    
    for (const element of iconElements) {
      const iconName = element.getAttribute('data-icon');
      if (!iconName) continue;
      
      // 如果已经渲染过，跳过
      if (element.querySelector('svg')) continue;
      
      const svg = await fetchIcon(iconName);
      if (svg) {
        element.innerHTML = svg;
        // 设置 SVG 样式
        const svgElement = element.querySelector('svg');
        if (svgElement) {
          svgElement.setAttribute('width', '1em');
          svgElement.setAttribute('height', '1em');
          svgElement.style.display = 'block';
        }
      }
    }
  }
  
  // 页面加载完成后渲染图标
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderIcons);
  } else {
    renderIcons();
  }
  
  // 支持 Astro 页面切换
  document.addEventListener('astro:page-load', renderIcons);
  
  // 暴露全局函数以便手动调用
  window.renderProseLinkIcons = renderIcons;
})();
