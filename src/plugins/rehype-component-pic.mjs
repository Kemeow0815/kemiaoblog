/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Pic 图片组件
 * 用于展示图片，支持说明文字、点击后打开灯箱缩放
 *
 * @param {Object} properties - 组件属性
 * @param {string} properties.src - 图片 URL (必需)
 * @param {string} [properties.alt] - 图片替代文本
 * @param {string} [properties.caption] - 图片说明文字
 * @param {string|number} [properties.width] - 图片宽度
 * @param {string|number} [properties.height] - 图片高度
 * @param {boolean} [properties.zoom] - 是否启用点击缩放，默认为 true
 * @param {import('mdast').RootContent[]} children - 子元素
 * @returns {import('mdast').Parent} 创建的 Pic 组件
 */
export function PicComponent(properties, children) {
  // 提取属性
  const src = properties.src || "";
  const alt = properties.alt || "";
  const caption = properties.caption || "";
  const width = properties.width || "";
  const height = properties.height || "";
  const zoom = properties.zoom !== "false" && properties.zoom !== false;

  // 如果没有图片源，返回错误提示
  if (!src) {
    return h(
      "div",
      { class: "pic-error" },
      "Invalid pic directive. (pic must have \"src\" attribute)",
    );
  }

  // 构建图片属性
  const imgProps = {
    src: src,
    alt: alt || caption,
    class: "pic-image",
  };

  // 添加可选属性
  if (width) imgProps.width = width;
  if (height) imgProps.height = height;

  // 如果启用缩放，添加相关属性
  if (zoom) {
    imgProps["data-zoom"] = "true";
    imgProps.style = "cursor: zoom-in;";
  }

  // 构建 figure 的子元素
  const figureChildren = [h("img", imgProps)];

  // 如果有说明文字，添加 figcaption
  const displayCaption = caption || alt;
  if (displayCaption) {
    figureChildren.push(
      h("figcaption", { class: "pic-caption" }, displayCaption),
    );
  }

  // 构建 figure 容器
  const figureProps = {
    class: "pic-figure",
  };

  return h("figure", figureProps, figureChildren);
}
