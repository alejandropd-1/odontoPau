---
name: openspec
description: Usar la CLI y el formato de OpenSpec para preparar, actualizar, implementar o cerrar cambios de este proyecto.
---

# Referencia de OpenSpec

La CLI devuelve las instrucciones y rutas del esquema; consultarlas para la operación pedida. La versión comprobada en estos proyectos es 1.12.0, ejecutable con `pnpm dlx @fission-ai/openspec@1.12.0`. `pnpm exec openspec --version` muestra la instalada, que puede ser distinta.

| Operación | Comandos después del prefijo de la CLI |
|---|---|
| Localizar cambios | `list`, `show <id>` |
| Crear | `new change <id>` |
| Consultar documentos pendientes | `status --change <id> --json` |
| Obtener formato y rutas | `instructions <artifact> --change <id> --json` |
| Consultar implementación | `instructions apply --change <id> --json` |
| Consultar cierre | `instructions archive --change <id> --json`, `archive --help` |
| Validar documentos | `validate --all --strict` |

El esquema spec-driven utiliza proposal.md, design.md, specs y tasks.md. Las rutas efectivas vienen en la respuesta de la CLI, incluso si el proyecto usa un store externo.

Detalles del formato:
- Las capacidades nuevas llevan `## Purpose` y `## ADDED Requirements`.
- Los requisitos usan SHALL/MUST y escenarios `#### Scenario:`.
- Los deltas MODIFIED contienen el bloque completo del requisito existente con su nombre exacto.
- Las tareas tienen formato `- [ ] X.Y ...` y se completan con `[x]`.
- `status` con artefactos completos significa planificación completa. La ejecución se refleja en tasks.md y su evidencia.
- `archive` puede sincronizar requisitos hacia las specs principales; no despliega el producto.
