/// <reference types="mdast" />
import { h } from "hastscript";
import { getDomain, isExtLink, getDomainIcon } from "./prose-link-utils.mjs";

/**
 * Creates a LinkCard component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.link - Link URL (required).
 * @param {string} properties.title - Title text (required).
 * @param {string} [properties.description] - Description text (optional, defaults to domain of link).
 * @param {string} [properties.icon] - Custom icon URL (optional, auto-detected from domain if not provided).
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created LinkCard component.
 */
export function LinkCardComponent(properties, children) {
	// 提取属性
	const link = properties.link || "";
	const title = properties.title || "";
	const description = properties.description || "";
	const customIcon = properties.icon || "";

	// 如果没有标题或链接，返回错误提示
	if (!title || !link) {
		return h(
			"div",
			{ class: "hidden" },
			'Invalid link-card directive. (link-card must have "title" and "link" attributes)',
		);
	}

	// 确定显示的描述文本
	const displayDescription = description || getDomain(link) || "";

	// 确定图标
	let iconUrl = customIcon;
	if (!iconUrl) {
		// 尝试从域名获取图标
		const domainIcon = getDomainIcon(link);
		if (domainIcon) {
			// 使用 Iconify 图标服务
			iconUrl = `https://api.iconify.design/${domainIcon.replace(':', '/')}.svg`;
		}
	}

	// 构建 info 区域的子元素
	const infoChildren = [];

	// 标题
	infoChildren.push(h("div", { class: "link-card-title" }, title));

	// 描述
	if (displayDescription) {
		infoChildren.push(
			h("div", { class: "link-card-description" }, displayDescription),
		);
	}

	// 构建主容器的子元素
	const cardChildren = [
		h("div", { class: "link-card-info" }, infoChildren),
	];

	// 添加图标（如果有）
	if (iconUrl) {
		cardChildren.push(
			h("img", {
				class: "link-card-icon",
				src: iconUrl,
				alt: title,
				loading: "lazy",
			}),
		);
	}

	// 构建主容器
	const isExternal = isExtLink(link);
	const linkProps = {
		class: "link-card card",
		href: link,
		title: [title, description, link].filter(Boolean).join(" - "),
	};

	if (isExternal) {
		linkProps.target = "_blank";
		linkProps.rel = "noopener noreferrer";
	}

	return h("a", linkProps, cardChildren);
}
