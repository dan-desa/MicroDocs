import type { DocsConfig } from '../types/docs.types';

const basePathEnv = import.meta.env.DOCS_BASE_PATH;
const isExternalEnv = import.meta.env.DOCS_IS_EXTERNAL === 'true';

export const DOCS_CONFIG: DocsConfig = {
  basePath: basePathEnv || 'C:/Dev/learning/MicroDocs_content/docs-content',
  isExternal: isExternalEnv || false,
};

if (!DOCS_CONFIG.basePath) {
  throw new Error('DOCS_CONFIG.basePath must be defined');
}