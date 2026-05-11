/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a BlogHeader component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} [properties.logo] - Logo image URL.
 * @param {string} [properties.title] - Blog title text.
 * @param {string} [properties.subtitle] - Blog subtitle text.
 * @param {string} [properties.link] - Link URL for the header.
 * @param {string} [properties.emoji] - Comma-separated emoji list for background animation.
 * @param {boolean} [properties.showTitle] - Whether to show title text (default: true).
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created BlogHeader component.
 */
export function BlogHeaderComponent(properties, children) {
	// 提取属性
	const logo = properties.logo || "";
	const title = properties.title || "";
	const subtitle = properties.subtitle || "";
	const link = properties.link || "";
	const emojiStr = properties.emoji || "";
	const showTitle = properties.showTitle !== "false" && properties.showTitle !== false;

	// 解析 emoji 列表
	const emojiList = emojiStr
		? emojiStr.split(/[,，]/).map((e) => e.trim()).filter(Boolean)
		: [];

	// 构建 blog-header 子元素
	const headerChildren = [];

	// Emoji 背景动画层
	if (emojiList.length > 0) {
		const emojiSpans = emojiList.map((emoji, index) => {
			const delay = index * 0.6 - 3;
			return h("span", {
				class: "bh-emoji-char",
				style: `--delay: ${delay}s`,
			}, emoji);
		});
		headerChildren.push(
			h("div", { class: "bh-emoji-tail" }, emojiSpans),
		);
	}

	// Logo 图片
	if (logo) {
		const logoClass = showTitle ? "bh-logo bh-logo-circle" : "bh-logo";
		headerChildren.push(
			h("img", {
				class: logoClass,
				src: logo,
				alt: title || "blog logo",
				loading: "lazy",
			}),
		);
	}

	// 标题和副标题文本
	if (showTitle && (title || subtitle)) {
		const textChildren = [];

		if (title) {
			// 将标题拆分为单个字符，每个字符都有动画
			const titleChars = title.split("").map((char, index) => {
				const delay = (index + 1) * 0.1;
				return h("span", {
					class: "bh-title-char",
					style: `--delay: ${delay}s`,
				}, char);
			});
			textChildren.push(
				h("div", { class: "bh-title" }, titleChars),
			);
		}

		if (subtitle) {
			textChildren.push(
				h("div", { class: "bh-subtitle" }, subtitle),
			);
		}

		headerChildren.push(
			h("div", { class: "bh-text" }, textChildren),
		);
	}

	// 构建主容器
	const headerProps = { class: "blog-header" };

	// 如果有链接，包装在 a 标签中
	if (link) {
		return h("a", {
			class: "blog-header-link",
			href: link,
		}, [h("div", headerProps, headerChildren)]);
	}

	return h("div", headerProps, headerChildren);
}
