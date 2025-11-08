---
title: "Observability Stack"
description: "Guía para Observability Stack"
order: 12
---

# Runbook — Operaciones en Producción

## Monitoreo
- **Grafana**: http://<vps>:13000
- **Prometheus**: http://<vps>:19090

## Recuperación
- Reiniciar replicador:
  ```bash
  cd /srv/etl-stack && docker compose restart replicator