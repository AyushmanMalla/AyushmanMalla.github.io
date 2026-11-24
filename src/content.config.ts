import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { isSafeLocalVideoPath } from './utils/security';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			heroVideo: z
				.string()
				.refine(isSafeLocalVideoPath, {
					message: 'heroVideo must be a root-relative local .webm or .mp4 path (e.g. /media/wave.webm)',
				})
				.optional(),
			heroAlt: z.string().optional(),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
