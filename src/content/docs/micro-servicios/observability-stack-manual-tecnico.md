---
title: "Observability Stack Manual Tecnico"
description: "Guía para Observability Stack Manual Tecnico"
order: 11
---

### Manual Tecnico
Este módulo provee monitoreo en tiempo real para la plataforma de ETL + Reporterías mediante:
    • Prometheus → Recolección de métricas
    • Grafana → Visualización mediante dashboards
    • Alertas → Salud del replicador, lag, errores
    • Dashboards preinstalados → Estado del ETL, KPIs del DW, rendimiento, consumo, errores
Se usa principalmente para:
    • Detectar caídas del replicador
    • Medir latencia entre OLTP → DW
    • Auditar integridad de reconciliaciones
    • Visualizar KPIs de reportería
    • Supervisar rendimiento de Postgres y Redis 

### Estructura del Repositorio
observability-stack/
├── grafana/
│   └── provisioning/
│       ├── dashboards/
│       │   ├── dashboards.yml
│       │   └── etl_replicator_overview.json   # Dashboard de replicación ETL
│       │
│       └── datasources/
│           └── datasource.yml                 # Datos de Prometheus como fuente
│
├── prometheus/
│   ├── alerts.yml                             # Alertas configuradas
│   └── prometheus.yml                         # Configuración principal
│
├── .env                                       # Variables del stack
├── README.md                                  # Documentación
└── docker-compose.yml                         # Orquestación completa

### Diagrama de Arquitectura
flowchart LR
    ETL[ETL Replicator] -->|Métricas / Pushgateway| Prometheus
    DW[(PostgreSQL DW)] --> Prometheus
    Redis[(Redis Cache)] --> Prometheus

    Prometheus --> Grafana

    Grafana --> Admin[Operaciones / Monitoreo]

 ## Archivos Clave
-grafana/provisioning/datasources/datasource.yml
    Define la conexión de Grafana a Prometheus.
-grafana/provisioning/dashboards/dashboards.yml
    Carga automática de dashboards.
-etl_replicator_overview.json
Dashboard principal que muestra:
Retraso de replicación (etl_replication_lag_seconds)
    • Eventos procesados
    • Errores del replicador
    • Desempeño de Postgres DW
    • Estado de Redis Cache
    • Alertas activas
-prometheus/prometheus.yml
    • Configura Prometheus para leer métricas del sistema.
-prometheus/alerts.yml
    • Define alertas críticas:
    • Replicator caído
    • Retraso mayor a 300s
    • Disco de Postgres > 85%
    • Redis sin responder

 ## Levantar el Sistema
- Crear red necesaria
docker network create analytics-net || true
- Ejecutar el stack de monitoreo
docker compose up -d --build
- Accesos
| Servicio   | URL                                              |
| ---------- | ------------------------------------------------ |
| Grafana    | [http://localhost:13000](http://localhost:13000) |
| Prometheus | [http://localhost:19090](http://localhost:19090) |

 ## Runbook — Operaciones en Producción
Esta sección describe qué hacer ante incidentes comunes.
- Verificar si Prometheus está recibiendo métricas
curl http://localhost:19090/metrics
- Reiniciar el replicador
cd /srv/etl-stack
docker compose restart replicator
-Validar que Grafana está cargando los dashboards
Ingresar a:
http://<ip-servidor>:13000
Revisar carpeta: ETL Monitoring
- Ver logs del replicador
docker logs -f etl-replicator
- Validar delay de replicación
En Prometheus:
etl_replication_lag_seconds
Valor recomendado:
< 60 segundos

 ## Posibles Errores y Soluciones
-Error: “Grafana no muestra dashboards”
-Solución:
   Revisar dashboards.yml
   Verificar rutas de montaje en Docker Compose
-Error: “Prometheus no puede conectar a replicator”
-Solución:
   Verificar network analytics-net
   Revisar puertos y hostnames
-Error: “Retrasos altos en replicación”
-Solución:
   Evaluar carga de SQL Server
   Revisar logs de ETL
   Limpiar Redis si está saturado
-Error: “Grafana pide login repetidamente”
-Solución:
   Revisar permisos de volumen:
   chown -R 472:472 grafana-data/