import { getCollection } from 'astro:content';
import type { DocCategory, DocPage } from '../types/docs.types';

export async function getDocsNavigation(): Promise<DocCategory[]> {
  const docs = await getCollection('docs', ({ data }) => {
    return data.draft !== true;
  });

  const categoriesMap = new Map<string, DocPage[]>();

  docs.forEach((doc) => {
    const pathParts = doc.slug.split('/');
    const category = pathParts[0];
    const pageSlug = pathParts.slice(1).join('/') || pathParts[0];

    const page: DocPage = {
      slug: doc.slug,
      title: doc.data.title,
      description: doc.data.description,
      order: doc.data.order ?? 999,
      category,
    };

    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, []);
    }
    categoriesMap.get(category)!.push(page);
  });

  const categories: DocCategory[] = Array.from(categoriesMap.entries()).map(
    ([slug, pages]) => ({
      slug,
      name: formatCategoryName(slug),
      pages: pages.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    })
  );

  return categories;
}

function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}