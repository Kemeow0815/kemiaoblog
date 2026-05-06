import { defineCollection, z } from 'astro:content'
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        draft: z.boolean().optional().default(false),
        description: z.string().optional().default(''),
        image: z.string().optional().default(''),
        slugId: z.string(),
        category: z.string().optional(),
        pinTop: z.number().optional().default(0),
    }),
})

const specCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/spec" }),
})
const memosCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/memos" }),
    schema: z.object({
        tags: z.array(z.string()).optional().default([]),
        words: z.number().optional().default(0),
        minutes: z.number().optional().default(0),
    }),
})
export const collections = {
    blog: blogCollection,
    spec: specCollection,
    memos: memosCollection,
}