import type { DocsConfig } from '../types/docs.types';

const basePathEnv = import.meta.env.DOCS_BASE_PATH || process.env.DOCS_BASE_PATH || '/app/docs-content';
const isExternalEnv = String(import.meta.env.DOCS_IS_EXTERNAL || process.env.DOCS_IS_EXTERNAL || 'false').toLowerCase() === 'true';

export const DOCS_CONFIG: DocsConfig = {
  basePath: basePathEnv,
  isExternal: isExternalEnv || false,
};

if (!DOCS_CONFIG.basePath) {
  throw new Error('DOCS_BASE_PATH environment variable must be defined');
}

// Validar que el path no esté vacío
if (DOCS_CONFIG.basePath.trim() === '') {
  throw new Error('DOCS_BASE_PATH cannot be empty');
}

// Validar formato de URL para externos
if (DOCS_CONFIG.isExternal) {
  try {
    new URL(DOCS_CONFIG.basePath);
  } catch {
    throw new Error(`DOCS_BASE_PATH must be a valid URL when DOCS_IS_EXTERNAL=true. Got: ${DOCS_CONFIG.basePath}`);
  }
}

console.log('Docs Config loaded:', {
  basePath: DOCS_CONFIG.basePath,
  isExternal: DOCS_CONFIG.isExternal,
  mode: DOCS_CONFIG.isExternal ? 'EXTERNAL SERVER' : 'LOCAL FILES'
});