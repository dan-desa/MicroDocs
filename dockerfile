# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Stage 1: Instalar dependencias
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod=false

# Stage 2: Build de la aplicación
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build time (opcional)
ARG DOCS_BASE_PATH
ARG DOCS_IS_EXTERNAL
ENV DOCS_BASE_PATH=$DOCS_BASE_PATH
ENV DOCS_IS_EXTERNAL=$DOCS_IS_EXTERNAL

# Validar variables de entorno en build
RUN if [ -z "$DOCS_BASE_PATH" ]; then \
      echo "Warning: DOCS_BASE_PATH not set, using default /app/docs-content"; \
    fi

RUN echo "Building with DOCS_BASE_PATH=${DOCS_BASE_PATH:-/app/docs-content} DOCS_IS_EXTERNAL=${DOCS_IS_EXTERNAL:-false}" && \
    pnpm build

# Stage 3: Producción
FROM base AS runtime

# Copiar solo archivos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Variables de entorno en runtime
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Exponer puerto
EXPOSE 4321

# Comando para iniciar
CMD ["node", "./dist/server/entry.mjs"]

# Crear directorio para archivos locales (si se usan)
RUN mkdir -p /app/docs-content

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321/', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"