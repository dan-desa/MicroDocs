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
}

export interface DocNavigation {
  categories: DocCategory[];
}
