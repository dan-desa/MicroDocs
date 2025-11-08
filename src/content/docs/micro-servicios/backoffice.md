---
title: "Back Office"
description: "Guía para Back Office"
order: 1
---

# FrontTablero



Aplicación **Angular 17+** para administrar y visualizar un **tablero de baloncesto** conectado a un backend en .NET Core + SQL Server.



Este proyecto es la **interfaz de usuario (frontend)** del sistema: permite crear **Localidades**,
**Equipos** y **Partidos** desde un módulo de administración, y llevar el **marcador en tiempo real** desde el tablero principal.



---



## Características principales



-	**Marcador interactivo** con control de puntos, faltas, cronómetro y cuartos.

-	**Módulo Admin** para registrar:

-	Localidades

-	Equipos

-	Partidos programados

-	**Integración con backend** (ASP.NET Core + EF Core):

-	CRUD de Localidades, Equipos y Partidos

-	Registro automático de los 4 cuartos jugados

-	**Arquitectura Angular moderna**:

-	Standalone components

-	Services organizados

-	`tablero.facade.ts` como **fachada** que centraliza la lógica
 
-	Código tipado con **interfaces en `models.ts`**



---



## Estructura del proyecto



```bash

src/app/

│

├── core/

│ ├── models.ts	# Interfaces tipadas: Partido, Equipo, Cuarto, Localidad, Itabler

│ ├── services/	# Servicios Angular HttpClient para Localidad, Equipo, Partido, Cuarto

│ └── tablero.facade.ts	# Fachada que coordina llamadas al backend

│

├── pages/

│ ├── home-page.component.*  # Tablero principal (marcador en tiempo real)

│ └── admin-page.component.* # CRUD de Localidades, Equipos y Partidos

│

├── app.component.*	# Layout con header + rutas

└── app.routes.ts	# Configuración de rutas


# 🎨 Front-Tablero - Documentación Completa

## 📖 Descripción General
**Front-Tablero** es el **frontend** desarrollado en **Angular** para el sistema de tablero deportivo.  
Este proyecto consume la API REST del backend **Back-Tablero** y presenta una interfaz de usuario para la gestión de:
- Autenticación y login de usuarios.
- Administración de equipos y jugadores.
- Creación y seguimiento de partidos.
- Visualización del tablero en tiempo real.

---

## 📂 Estructura del Proyecto

```plaintext
frontTablero-main/
│── .editorconfig
│── .gitignore
│── angular.json
│── package.json
│── package-lock.json
│── tsconfig.json
│── tsconfig.app.json
│── tsconfig.spec.json
│── Dockerfile
│── nginx-default.conf
│── public/
│   └── favicon.ico
│
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   │
│   ├── app/
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   ├── app.component.spec.ts
│   │   └── (módulos y componentes adicionales)
│
└── .vscode/   # Configuración de VSCode
```

---

## Requisitos Previos

Antes de ejecutar el frontend asegúrate de tener instalado:

- [Angular CLI](https://angular.io/cli)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (opcional para despliegue con contenedores)
- [Git](https://git-scm.com/)

---

## Instalación y Ejecución

###  Clonar repositorio
```bash
git clone <url-repo>
cd frontTablero-main
```

### Instalar dependencias
```bash
npm install
```

###  Ejecutar en modo desarrollo
```bash
ng serve -o
```

La aplicación estará disponible en:  
[http://localhost:4200](http://localhost:4200)

###  Compilar para producción
```bash
ng build --configuration production
```

###  Ejecutar con Docker
```bash
docker build -t front-tablero .
docker run -d -p 80:80 front-tablero
```

---

##  Conexión con Backend

Este frontend consume la API expuesta por **Back-Tablero**.  
Por defecto, las peticiones se dirigen a:

```ts
http://localhost:5000/api
```

 Ajusta la URL en tus servicios Angular (`environment.ts` o servicios en `/src/app/`) según tu configuración de backend.

---

##  Estructura de Angular

- **`app.component.*`** → Componente principal.
- **`/services`** → Servicios para consumir la API REST.
- **`/pages`** → Páginas principales (ej. login, equipos, jugadores, partidos).
- **`/shared`** → Componentes compartidos (botones, layouts, etc.).
- **`styles.css`** → Estilos globales.

---

##  Scripts útiles

### Ejecutar pruebas unitarias
```bash
ng test
```

### Ejecutar pruebas end-to-end
```bash
ng e2e
```

---

##  Próximos pasos

-  Mejorar integración con **Back-Tablero**.  
-  Añadir autenticación JWT en los servicios.  
-  Crear vistas específicas para **administrador / usuario normal**.  
-  Integrar **Docker Compose** para levantar backend y frontend juntos.  

---

##  Autores
Proyecto desarrollado en la **Universidad Mariano Gálvez - Ingeniería en Sistemas**  
Equipo: *Tablero Deportivo*
