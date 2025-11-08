---
title: "Exportar"
description: "Guía para Exportar"
order: 7
---

### Manual Tecnico



Data Import Service es un microservicio en Java Spring Boot diseñado para:


   • Importar datos desde archivos CSV o JSON.


   • Insertar o actualizar información en la base de datos.


   • Validar contenido antes de ser persistido.


   • Ofrecer un endpoint REST para subir archivos.


   • Asegurar integridad de datos mediante validadores.


   • Servir como puente entre las hojas de datos y el backend principal del Tablero Deportivo.


Funciona con entidades como:


   • Equipos


   • Jugadores


   • Localidades


   • Partidos





### Estructura del Repositorio


data-import-service/


├── .github/


│   └── workflows/


│       └── publish-ghcr.yml             # Pipeline para publicar imagen en GitHub Container Registry


│


├── .mvn/wrapper/


│   └── maven-wrapper.properties         # Configuración del wrapper Maven


│


├── scripts/


│   └── wait-for-sql.sh                 # Script para esperar SQL antes de iniciar servicio


│


├── src/


│   ├── main/


│   │   ├── java/com/importservice/


│   │   │   ├── config/


│   │   │   │   ├── JacksonConfig.java   # Configuración JSON


│   │   │   │   └── OpenApiConfig.java   # Swagger/OpenAPI


│   │   │   │


│   │   │   ├── controller/


│   │   │   │   └── ImportController.java # Endpoints REST


│   │   │   │


│   │   │   ├── entity/                  # Entidades JPA


│   │   │   │   ├── DataEntity.java


│   │   │   │   ├── Equipo.java


│   │   │   │   ├── Jugador.java


│   │   │   │   ├── Localidad.java


│   │   │   │   └── Partido.java


│   │   │   │


│   │   │   ├── repository/              # Repositorios JPA


│   │   │   │   ├── DataRepository.java


│   │   │   │   ├── EquipoRepository.java


│   │   │   │   ├── JugadorRepository.java


│   │   │   │   ├── LocalidadRepository.java


│   │   │   │   └── PartidoRepository.java


│   │   │   │


│   │   │   ├── service/


│   │   │   │   └── ImportService.java   # Lógica principal de importación


│   │   │   │


│   │   │   ├── validator/               # Validadores de datos


│   │   │   │   ├── EquipoValidator.java


│   │   │   │   ├── JugadorValidator.java


│   │   │   │   ├── LocalidadValidator.java


│   │   │   │   └── PartidoValidator.java


│   │   │   │


│   │   │   ├── dto/


│   │   │   │   ├── FileUpload.java


│   │   │   │   ├── ImportRequest.java


│   │   │   │   └── ImportResponse.java


│   │   │   │


│   │   │   └── DataImportServiceApplication.java  # Clase principal Spring Boot


│   │   │


│   │   └── resources/


│   │       ├── application.properties


│   │       └── application-test.properties


│   │


│   ├── test/


│   │   ├── java/com/importservice/data_import_service/service/


│   │   │   ├── ImportServiceTest.java


│   │   │


│   │   ├── temp/


│   │   │   └── DataImportServiceApplicationTests.java


│   │   │


│   │   └── test-data/


│   │       ├── equipo.csv


│   │       ├── equipo.json


│   │       ├── jugador.csv


│   │       ├── jugador.json


│   │       ├── localidad.csv


│   │       ├── localidad.json


│   │       ├── partido.csv


│   │       └── partido.json


│


├── .dockerignore


├── .env


├── .gitattributes


├── .gitignore


├── Dockerfile                           # Imagen Docker del microservicio


├── ESTRUCTURA_ARCHIVOS.md


├── README_DOCKER.md


├── directory_tree.txt


├── docker-compose.yml


├── mvnw


├── mvnw.cmd


└── pom.xml                               # Dependencias Maven





### Diagrama de arquitectura


flowchart LR


    A[Usuario / Admin] --> B[Frontend]


    B --> C[Backend Principal (.NET)]


    C --> D[Data Import Service (Spring Boot)]


    D -->|Importación| E[Base de Datos SQL Server]


    D --> F[Validadores]





### Detalle de microservicios y lenguajes


Lenguaje:


   • Java 17+


Framework:


   • Spring Boot 3.x


Dependencias principales:


   • Spring Web


   • Spring Data JPA


   • PostgreSQL / SQL Server Driver (según configuración)


   • Jackson (JSON)


   • OpenAPI (Swagger)


   • Maven


Infraestructura:


   • Docker + Docker Compose


   • GitHub Actions para publicación en GHCR





### Cómo levantar el sistema localmente 


 - Requisitos


   • Java 17+


   • Maven


 - Docker 


   • Variables de entorno (archivo .env)


SPRING_DATASOURCE_URL=jdbc:sqlserver://host:1433;databaseName=Tablero


SPRING_DATASOURCE_USERNAME=sa


SPRING_DATASOURCE_PASSWORD=password


SPRING_JPA_HIBERNATE_DDL_AUTO=none


 - Ejecutar localmente


./mvnw spring-boot:run


La API estará disponible en:


http://localhost:8080


 - Ejecutar con Docker


docker build -t data-import-service .


docker run -p 8080:8080 --env-file .env data-import-service


 - Orquestación con Docker Compose


docker compose up -d





### Especificación de endpoints por microservicio


Importación


 - POST /import


Tipologías soportadas:


   • equipo


   • jugador


   • localidad


   • partido


Salud del servicio


 - GET /health





### Seguridad


Este microservicio suele operar internamente dentro de la red del sistema.


 - Puede trabajar detrás de API Gateway o Backend principal.


 - API Key para uso externo.





### Validación de Datos


Antes de almacenar datos, el microservicio valida:


   • Formato del archivo


   • Campos obligatorios


   • Duplicados


   • Consistencia (IDs válidos)


   • Integridad relacional


Validadores incluidos:


   • EquipoValidator


   • JugadorValidator


   • LocalidadValidator


   • PartidoValidator





### Bibliotecas/librerías utilizadas


| Biblioteca      | Uso                     |


| --------------- | ----------------------- |


| Spring Web      | Crear API REST          |


| Spring Data JPA | Persistencia            |


| Jackson         | Lectura de JSON         |


| OpenAPI/Swagger | Documentación de API    |


| JUnit           | Pruebas unitarias       |


| Maven           | Gestión de dependencias |





### Posibles errores y soluciones


-Error: “Failed to parse CSV”


-Solución:


   Validar separadores


   Asegurar encabezados correctos


-Error: “Entity not found”


-Solución:


   Verificar integridad de IDs relacionados


-Error: Conexión rechazada (SQL Server)


-Solución:


   Revisar SPRING_DATASOURCE_URL


   Verificar firewall o puertos


-Error: “Duplicate key”


-Solución:


   Revisar claves primarias en CSV/JSON


   Quitar duplicados antes de importar