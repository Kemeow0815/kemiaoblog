/// <reference types="mdast" />
import { h } from "hastscript";
import { getDomain, isExtLink } from "./prose-link-utils.mjs";

/**
 * 获取 GitHub 用户名
 * @param {string} url - URL 字符串
 * @returns {string|null} - GitHub 用户名或 null
 */
function getGithubUsername(url) {
	if (!url) return null;
	try {
		const urlObj = new URL(url);
		if (urlObj.hostname !== "github.com") return null;
		const pathParts = urlObj.pathname.split("/").filter(Boolean);
		if (pathParts.length >= 1) return pathParts[0];
		return null;
	} catch {
		return null;
	}
}

/**
 * 获取 GitHub 用户头像 URL
 * @param {string} username - GitHub 用户名
 * @returns {string} - 头像 URL
 */
function getGithubAvatar(username) {
	return `https://github.com/${username}.png`;
}

/**
 * 获取站点 favicon URL
 * @param {string} domain - 域名
 * @returns {string} - favicon URL
 */
function getFavicon(domain) {
	return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * 安全解码 URI 组件
 * @param {string} str - 需要解码的字符串
 * @returns {string} - 解码后的字符串
 */
function safelyDecodeUriComponent(str) {
	if (!str) return "";
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
}

/**
 * Creates a Badge component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} [properties.img] - Image URL for the badge icon.
 * @param {string} [properties.text] - Text content of the badge.
 * @param {string} [properties.link] - Link URL for the badge.
 * @param {boolean} [properties.round] - Whether to use round style (for text-only badges).
 * @param {boolean} [properties.square] - Whether to use square style (for image badges).
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Badge component.
 */
export function BadgeComponent(properties, children) {
	// 处理文本内容：优先使用 text 属性，否则使用 children 的文本
	let text = properties.text || "";
	if (!text && Array.isArray(children) && children.length > 0) {
		// 从 children 中提取文本
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

	const link = properties.link || "";
	const imgProp = properties.img || "";
	const roundProp = properties.round !== undefined;
	const squareProp = properties.square !== undefined;

	// 确定图片 URL
	let imgUrl = imgProp;
	if (!imgUrl && link) {
		const ghUsername = getGithubUsername(link);
		if (ghUsername) {
			imgUrl = getGithubAvatar(ghUsername);
		} else if (isExtLink(link)) {
			imgUrl = getFavicon(getDomain(link));
		}
	}

	// 确定是否为圆形
	// 有图时默认为圆形样式，除非指定为方形
	// 无图时默认为方形样式，除非指定为圆形
	const isRound = imgUrl ? !squareProp : roundProp;

	// 确定 tooltip 提示
	let tip = "";
	if (link) {
		if (isExtLink(link)) {
			tip = getDomain(link);
		} else {
			tip = safelyDecodeUriComponent(link);
		}
	}

	// 构建 badge 内部元素
	const badgeChildren = [];

	// 添加图片
	if (imgUrl) {
		badgeChildren.push(
			h("img", {
				class: "badge-icon",
				src: imgUrl,
				alt: "",
				loading: "lazy",
			}),
		);
	}

	// 添加文本
	if (text) {
		badgeChildren.push(h("span", { class: "badge-text" }, text));
	}

	// 构建 class
	const classNames = ["badge"];
	if (isRound) classNames.push("round");

	// 构建属性
	const badgeProps = { class: classNames.join(" ") };
	if (tip) badgeProps["data-tip"] = tip;

	// 如果有链接，包装在 a 标签中
	if (link) {
		const isExternal = isExtLink(link);
		const linkProps = {
			class: "badge-link",
			href: link,
		};
		if (isExternal) {
			linkProps.target = "_blank";
			linkProps.rel = "noopener noreferrer";
		}

		return h("a", linkProps, [h("span", badgeProps, badgeChildren)]);
	}

	// 无链接时返回 span
	return h("span", badgeProps, badgeChildren);
}
