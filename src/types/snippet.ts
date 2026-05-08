import type { RenderResult } from 'astro:content';

export interface SnippetFrontmatter {
    title: string;
    description?: string;
    filename?: string;
    lang?: string;
    order?: number;
}

export interface Snippet {
    id: string;
    slug: string;
    body: string;
    collection: 'snippets';
    data: SnippetFrontmatter;
    rendered?: RenderResult;
}

export interface SnippetCodeBlock {
    filename?: string;
    lang?: string;
    code: string;
}
