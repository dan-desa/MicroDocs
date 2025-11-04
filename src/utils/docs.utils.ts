import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DOCS_CONFIG } from '../config/docs.config';
import type { DocCategory, DocPage } from '../types/docs.types';
import { parseMarkdown, sanitizeSlug } from './markdown.utils';

async function fetchExternalFile(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.text();
}

async function readLocalFile(path: string): Promise<string> {
  return readFile(path, 'utf-8');
}

export async function getMarkdownContent(slug: string) {
  const sanitized = sanitizeSlug(slug);
  
  try {
    let rawContent: string;
    
    if (DOCS_CONFIG.isExternal) {
      const url = `${DOCS_CONFIG.basePath}/${sanitized}.md`;
      rawContent = await fetchExternalFile(url);
    } else {
      // Validar que basePath existe antes de usarlo
      if (!DOCS_CONFIG.basePath) {
        throw new Error('basePath is not configured');
      }
      const filePath = join(DOCS_CONFIG.basePath, `${sanitized}.md`);
      rawContent = await readLocalFile(filePath);
    }
    
    const parsed = await parseMarkdown(rawContent);
    
    // Validar que el documento no esté en borrador
    if (parsed.frontmatter.draft) {
      console.warn(`Document ${slug} is marked as draft`);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error loading markdown for slug: ${slug}`, error);
    return null;
  }
}

async function scanLocalDirectory(basePath: string): Promise<DocPage[]> {
  const pages: DocPage[] = [];
  
  async function scan(currentPath: string, relativePath: string = '') {
    const entries = await readdir(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        await scan(fullPath, relPath);
      } else if (entry.name.endsWith('.md')) {
        try {
          const content = await readFile(fullPath, 'utf-8');
          const parsed = await parseMarkdown(content);
          
          if (parsed.frontmatter.draft) continue;
          
          const slug = relPath.replace(/\.md$/, '');
          const pathParts = slug.split('/');
          const category = pathParts[0];
          
          pages.push({
            slug,
            title: parsed.frontmatter.title,
            description: parsed.frontmatter.description,
            order: parsed.frontmatter.order ?? 999,
            category,
          });
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error);
        }
      }
    }
  }
  
  await scan(basePath);
  return pages;
}

export async function getDocsNavigation(): Promise<DocCategory[]> {
  try {
    let pages: DocPage[];
    
    if (DOCS_CONFIG.isExternal) {
      // Para servidor externo, necesitas un endpoint que liste archivos
      const indexUrl = `${DOCS_CONFIG.basePath}/index.json`;
      const response = await fetch(indexUrl);
      if (!response.ok) {
        throw new Error(`Cannot fetch docs index from ${indexUrl}: ${response.status}`);
      }
      pages = await response.json();
    } else {
      if (!DOCS_CONFIG.basePath) {
        throw new Error('basePath is not configured');
      }
      pages = await scanLocalDirectory(DOCS_CONFIG.basePath);
    }
    
    // Filtrar páginas en borrador
    pages = pages.filter(page => !page.draft);
    
    const categoriesMap = new Map<string, DocPage[]>();
    
    pages.forEach((page) => {
      if (!categoriesMap.has(page.category)) {
        categoriesMap.set(page.category, []);
      }
      categoriesMap.get(page.category)!.push(page);
    });
    
    const categories: DocCategory[] = Array.from(categoriesMap.entries()).map(
      ([slug, categoryPages]) => ({
        slug,
        name: formatCategoryName(slug),
        pages: categoryPages.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
      })
    );
    
    return categories;
  } catch (error) {
    console.error('Error getting docs navigation:', error);
    return [];
  }
}

function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}