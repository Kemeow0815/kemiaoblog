import rss from "@astrojs/rss";
import { getBlogEntrySort } from "../utils/content-utils"
import { siteConfig, profileConfig } from '../config';
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    const blog = await getBlogEntrySort("zh-cn");
    return rss({
        title: `${siteConfig.title} - ${siteConfig.subTitle}`,
        description: profileConfig.description,
        site: context.site ?? "https://blog.kemeow.top",
        stylesheet: '/rss.xsl',
        items: blog.slice(0, 20).map((post) => {
            const categories: string[] = [];
            if (post.data.category) {
                categories.push(post.data.category);
            }
            if (post.data.tags && Array.isArray(post.data.tags)) {
                categories.push(...post.data.tags);
            }

            const item: {
                title: string;
                pubDate: Date;
                description: string;
                link: string;
                categories?: string[];
                enclosure?: { url: string; type: string; length: number };
            } = {
                title: post.data.title,
                pubDate: post.data.pubDate,
                description: post.data.description || '',
                link: `/blog/${post.id}/`,
            };

            // 添加分类
            if (categories.length > 0) {
                item.categories = categories;
            }

            // 添加封面图片作为 enclosure
            if (post.data.image) {
                item.enclosure = {
                    url: post.data.image,
                    type: 'image/webp',
                    length: 0, // RSS 规范要求 length，但我们不知道实际大小
                };
            }

            return item;
        }),
    })
}
