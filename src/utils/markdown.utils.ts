import matter from 'gray-matter';
import { marked } from 'marked';
import type { MarkdownFile } from '../types/docs.types';

export async function parseMarkdown(rawContent: string): Promise<MarkdownFile> {
  const { data, content } = matter(rawContent);
  
  const htmlContent = await marked.parse(content, {
    gfm: true,
    breaks: true,
  });

  return {
    content: htmlContent,
    frontmatter: {
      title: data.title || 'Sin título',
      description: data.description,
      order: data.order,
      draft: data.draft || false,
    },
  };
}

export function sanitizeSlug(slug: string): string {
  return slug.replace(/\.\./g, '').replace(/^\/+/, '');
}