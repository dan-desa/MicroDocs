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
  try {
    return await readFile(path, 'utf-8');
  } catch (error) {
    throw new Error(`Cannot read local file at ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getMarkdownContent(slug: string) {
  const sanitized = sanitizeSlug(slug);
  
  try {
    let rawContent: string;
    
    if (DOCS_CONFIG.isExternal) {
      const url = `${DOCS_CONFIG.basePath}/${sanitized}.md`;
      console.log(`Fetching external file: ${url}`);
      rawContent = await fetchExternalFile(url);
    } else {
      if (!DOCS_CONFIG.basePath) {
        throw new Error('DOCS_BASE_PATH is not configured for local files');
      }
      const filePath = join(DOCS_CONFIG.basePath, `${sanitized}.md`);
      console.log(`Reading local file: ${filePath}`);
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error loading markdown for slug "${slug}":`, errorMessage);
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
      const indexUrl = `${DOCS_CONFIG.basePath}/index.json`;
      console.log(`Fetching docs index from: ${indexUrl}`);
      const response = await fetch(indexUrl);
      if (!response.ok) {
        throw new Error(`Cannot fetch docs index from ${indexUrl}: HTTP ${response.status}`);
      }
      pages = await response.json();
      console.log(`✓ Loaded ${pages.length} pages from external index`);
    } else {
      if (!DOCS_CONFIG.basePath) {
        throw new Error('DOCS_BASE_PATH is not configured for local files');
      }
      console.log(`Scanning local directory: ${DOCS_CONFIG.basePath}`);
      pages = await scanLocalDirectory(DOCS_CONFIG.basePath);
      console.log(`✓ Found ${pages.length} pages in local directory`);
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