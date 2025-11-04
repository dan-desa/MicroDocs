export interface DocCategory {
  slug: string;
  name: string;
  pages: DocPage[];
}

export interface DocPage {
  slug: string;
  title: string;
  description?: string;
  order?: number;
  category: string;
  draft?: boolean;
}

export interface DocNavigation {
  categories: DocCategory[];
}

export interface MarkdownFile {
  content: string;
  frontmatter: {
    title: string;
    description?: string;
    order?: number;
    draft?: boolean;
  };
}

export interface DocsConfig {
  basePath: string; // URL base para archivos .md
  isExternal: boolean; // true si es servidor externo
}