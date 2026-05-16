import { getBlogEntrySort } from "../../utils/content-utils";
import { i18n } from "astro:config/client";

export async function GET() {
	const defaultLocale = i18n!.defaultLocale;
	const posts = await getBlogEntrySort(defaultLocale);

	const allPostsData = posts.map((post) => {
		const date = new Date(post.data.pubDate);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		return {
			id: post.id,
			title: post.data.title,
			date: `${year}-${month}-${day}`,
		};
	});

	return new Response(JSON.stringify(allPostsData), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
