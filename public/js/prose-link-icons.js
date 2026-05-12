/**
 * ProseLink 图标渲染脚本
 * 使用 Iconify API 动态加载和渲染图标
 */

(function() {
  console.log('[ProseLink] Script loaded');
  
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
    console.log('[ProseLink] Fetching icon:', iconName);
    
    if (iconCache.has(iconName)) {
      console.log('[ProseLink] Using cached icon:', iconName);
      return iconCache.get(iconName);
    }
    
    const [prefix, name] = iconName.split(':');
    console.log('[ProseLink] Icon prefix:', prefix, 'name:', name);
    
    if (!prefix || !name) {
      console.log('[ProseLink] Invalid icon name:', iconName);
      return null;
    }
    
    try {
      const url = `${ICONIFY_API}/${prefix}/${name}.svg`;
      console.log('[ProseLink] Fetching from:', url);
      
      const response = await fetch(url);
      console.log('[ProseLink] Response status:', response.status);
      
      if (!response.ok) {
        console.log('[ProseLink] Failed to fetch icon:', iconName, response.status);
        return null;
      }
      
      const svg = await response.text();
      console.log('[ProseLink] Got SVG for:', iconName, 'length:', svg.length);
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
    console.log('[ProseLink] Rendering icons...');
    
    const iconElements = document.querySelectorAll('.prose-link-icon[data-icon]');
    console.log('[ProseLink] Found icon elements:', iconElements.length);
    
    for (const element of iconElements) {
      const iconName = element.getAttribute('data-icon');
      console.log('[ProseLink] Processing element with icon:', iconName);
      
      if (!iconName) {
        console.log('[ProseLink] No icon name, skipping');
        continue;
      }
      
      // 如果已经渲染过，跳过
      if (element.querySelector('svg')) {
        console.log('[ProseLink] Already rendered, skipping:', iconName);
        continue;
      }
      
      const svg = await fetchIcon(iconName);
      if (svg) {
        console.log('[ProseLink] Rendering icon:', iconName);
        element.innerHTML = svg;
        // 设置 SVG 样式
        const svgElement = element.querySelector('svg');
        if (svgElement) {
          svgElement.setAttribute('width', '1em');
          svgElement.setAttribute('height', '1em');
          svgElement.style.display = 'block';
          console.log('[ProseLink] Icon rendered successfully:', iconName);
        }
      } else {
        console.log('[ProseLink] Failed to get SVG for:', iconName);
      }
    }
    
    console.log('[ProseLink] Rendering complete');
  }
  
  // 页面加载完成后渲染图标
  console.log('[ProseLink] Document readyState:', document.readyState);
  if (document.readyState === 'loading') {
    console.log('[ProseLink] Waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', renderIcons);
  } else {
    console.log('[ProseLink] DOM already loaded, rendering immediately');
    renderIcons();
  }
  
  // 支持 Astro 页面切换
  document.addEventListener('astro:page-load', () => {
    console.log('[ProseLink] astro:page-load event');
    renderIcons();
  });
  
  // 暴露全局函数以便手动调用
  window.renderProseLinkIcons = renderIcons;
  console.log('[ProseLink] Script initialization complete');
})();
