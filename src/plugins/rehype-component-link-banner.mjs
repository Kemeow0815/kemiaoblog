/// <reference types="mdast" />
import { h } from "hastscript";
import { getDomain, isExtLink } from "./prose-link-utils.mjs";

/**
 * Creates a LinkBanner component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} [properties.banner] - Banner image URL.
 * @param {string} [properties.title] - Title text (required).
 * @param {string} [properties.description] - Description text (optional, defaults to domain of link).
 * @param {string} [properties.link] - Link URL (required).
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created LinkBanner component.
 */
export function LinkBannerComponent(properties, children) {
	// 提取属性
	const banner = properties.banner || "";
	const title = properties.title || "";
	const description = properties.description || "";
	const link = properties.link || "";

	// 如果没有标题或链接，返回错误提示
	if (!title || !link) {
		return h(
			"div",
			{ class: "hidden" },
			'Invalid link-banner directive. (link-banner must have "title" and "link" attributes)',
		);
	}

	// 确定显示的描述文本
	const displayDescription = description || getDomain(link) || "";

	// 构建 link-banner 子元素
	const bannerChildren = [];

	// 背景图片
	if (banner) {
		bannerChildren.push(
			h("img", {
				class: "link-banner-bg",
				src: banner,
				alt: title,
				loading: "lazy",
			}),
		);
	}

	// 渐变遮罩头部
	bannerChildren.push(h("div", { class: "link-banner-header" }));

	// 信息区域
	const infoChildren = [];

	// 标题
	if (title) {
		infoChildren.push(h("div", { class: "link-banner-title" }, title));
	}

	// 描述
	if (displayDescription) {
		infoChildren.push(
			h("div", { class: "link-banner-desc" }, displayDescription),
		);
	}

	bannerChildren.push(h("div", { class: "link-banner-info" }, infoChildren));

	// 构建主容器
	const isExternal = isExtLink(link);
	const linkProps = {
		class: "link-banner card",
		href: link,
		title: [title, description, link].filter(Boolean).join(" - "),
	};

	if (isExternal) {
		linkProps.target = "_blank";
		linkProps.rel = "noopener noreferrer";
	}

	return h("a", linkProps, bannerChildren);
}
