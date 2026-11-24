import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export function getPostSlug(post: BlogEntry): string {
	return post.id
		.replace(/\.(md|mdx)$/i, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function estimateReadingTime(body: string | undefined): number {
	if (!body) return 1;
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / 220));
}

export async function getSortedBlogPosts(): Promise<BlogEntry[]> {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
