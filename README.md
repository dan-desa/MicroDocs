# MicroDocs - Sistema de Documentación Dinámica

Sistema SSR de documentación construido con Astro 5, TypeScript 5 y Tailwind CSS 4.

## 🚀 Características

- ✅ Renderizado del lado del servidor (SSR)
- ✅ Archivos Markdown dinámicos
- ✅ Soporte para archivos locales y externos
- ✅ Contenedorización con Docker
- ✅ Organización por categorías
- ✅ Navegación automática

## 📋 Requisitos

- Node.js 20+
- pnpm 9+
- Docker y Docker Compose (para producción)

## 🛠️ Instalación
```bash
# Clonar repositorio
git clone <repo-url>
cd microdocs

# Instalar dependencias
pnpm install
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz:
```bash
# Archivos locales
DOCS_BASE_PATH=C:/Dev/learning/MicroDocs_content/docs-content
DOCS_IS_EXTERNAL=false

# O archivos externos
# DOCS_BASE_PATH=https://mi-servidor.com/docs
# DOCS_IS_EXTERNAL=true
```

### Estructura de Contenido
```
docs-content/
├── getting-started/
│   ├── installation.md
│   └── introduction.md
└── guides/
    └── first-steps.md
```

### Formato Markdown
```markdown
---
title: "Mi Documento"
description: "Descripción opcional"
order: 1
draft: false
---

# Contenido del documento
```

## 💻 Desarrollo
```bash
# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Previsualizar producción local
pnpm preview
```

## 🐳 Docker

### Opción 1: Archivos Externos
```bash
# Editar docker-compose.yml
DOCS_BASE_PATH=https://mi-servidor.com/docs
DOCS_IS_EXTERNAL=true

# Construir y ejecutar
docker-compose up -d
```

### Opción 2: Archivos Locales (Volumen)
```bash
# Editar docker-compose.yml - descomentar sección ALTERNATIVA 1
# Ajustar ruta del volumen:
volumes:
  - C:/Dev/learning/MicroDocs_content/docs-content:/app/docs-content:ro

# Construir y ejecutar
docker-compose up -d
```

### Opción 3: Con Servidor Nginx
```bash
# Editar docker-compose.yml - descomentar sección ALTERNATIVA 2

# Construir y ejecutar
docker-compose up -d

# Acceder a:
# - MicroDocs: http://localhost:4321
# - Archivos: http://localhost:8080/docs
```

### Comandos Docker
```bash
# Ver logs
docker-compose logs -f microdocs

# Reconstruir
docker-compose up -d --build

# Detener
docker-compose down

# Limpiar todo
docker-compose down -v --rmi all
```

## 📁 Estructura del Proyecto
```
microdocs/
├── src/
│   ├── components/      # Componentes Astro
│   ├── config/          # Configuración
│   ├── layouts/         # Layouts
│   ├── pages/           # Páginas dinámicas
│   ├── styles/          # Estilos globales
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Utilidades
├── public/              # Archivos estáticos
├── dockerfile           # Dockerfile producción
├── docker-compose.yml   # Orquestación Docker
└── package.json
```

## 🔍 Solución de Problemas

### Archivos no encontrados

1. Verificar `DOCS_BASE_PATH` en `.env`
2. Confirmar estructura de carpetas
3. Revisar logs: `docker-compose logs -f`

### Error de permisos (Docker)
```bash
# Windows: asegurar que Docker Desktop tenga permisos
# Linux: ajustar permisos
chmod -R 755 /ruta/a/docs-content
```

### Puerto en uso
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3000:4321"  # Usar 3000 en lugar de 4321
```

## 📚 Documentación

- [Astro SSR](https://docs.astro.build/en/guides/server-side-rendering/)
- [Docker](https://docs.astro.build/es/recipes/docker/)
- [Markdown](https://www.markdownguide.org/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE

## 👥 Autor

Tu Nombre - [@tuhandle](https://twitter.com/tuhandle)