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

RUN pnpm build

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