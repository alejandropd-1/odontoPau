# Retiro del cambio

## Motivo

Este cambio se retira porque su problema original y su línea base quedaron obsoletos después de completar `operativizar-dashboard-editorial-por-contenido`. El Panel editorial vigente ya obtiene el catálogo dinámicamente desde Tina, vive dentro del único `/admin`, compara cada pieza con la referencia pública y ofrece filtros, paginación, vistas persistidas y acciones por contenido.

Implementar este OpenSpec tal como fue escrito reintroduciría un dashboard separado en `/editorial`, un segundo sistema de autenticación, estados redundantes y dependencias sobre datos operativos que ya fueron eliminadas.

## Estado de implementación

- No se implementó ninguna de las 80 tareas.
- No se agregó Supabase al proyecto.
- No existen migraciones, tablas, políticas RLS, sesiones, roles ni sincronizaciones creadas por este cambio.
- Las tareas pendientes se conservan sin marcar para que el historial refleje que el alcance no fue ejecutado.

## Reemplazo

- La experiencia dinámica de catálogo, estados y publicación quedó cubierta por el cambio archivado `operativizar-dashboard-editorial-por-contenido`.
- Si se confirma una necesidad que Tina y Git no resuelven, el reemplazo planificado será `persistir-trazabilidad-operativa-editorial`.
- Ese reemplazo deberá limitarse a historial operativo persistente y métricas útiles, sin sustituir Tina, sin crear un segundo login, sin duplicar el inventario canónico y sin sumar estados visibles al usuario.

## Consecuencias

- Los delta specs de este cambio no deben sincronizarse porque describen requisitos obsoletos y uno de ellos ya no es compatible con la spec vigente de `dashboard-editorial`.
- Tina y los JSON versionados en Git continúan como fuente editorial canónica.
- El Panel editorial mantiene los tres estados cotidianos `Publicado`, `No publicado` y `Borrador`, acompañados por una explicación contextual.
- La incorporación de Supabase queda condicionada a un problema operativo concreto y verificable, no a la dinamización del catálogo, que ya está resuelta.
- No se modifica contenido clínico ni se publica o despliega producto como parte de este retiro.

## Autorización

Alejandro autorizó el retiro y reemplazo de este OpenSpec el 1 de septiembre de 2026.
