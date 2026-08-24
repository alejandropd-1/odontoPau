## Context

`pilotear-circuito-editorial-tina` instaló en producción el workflow que separa `Save` de `Publicar cambios`, restringe la promoción a la allowlist editorial, crea un PR técnico idempotente y vuelve a sincronizar `editorial/tina` después del merge. El bootstrap demostró edición y reversión en Preview, pero deliberadamente no ejecutó una publicación autónoma real porque el workflow todavía no existía en `main`.

Este cambio no agrega una segunda automatización. Usa la infraestructura publicada para demostrar su operación real, corregir sólo defectos bloqueantes y entregar una rutina que pueda seguir una persona no técnica. Participan un colaborador Tina autorizado, Paula cuando el contenido o la imagen requieran aprobación clínica y Alejandro como validador final del OpenSpec estructural.

## Goals / Non-Goals

**Goals:**

- Partir de `main` y `editorial/tina` convergentes y del schema Tina reindexado.
- Completar una actualización visible, un retiro y una republicación mediante la interfaz Tina y el workflow vigente.
- Verificar que el commit publicado, las rutas públicas, el estado editorial y las ramas coincidan después de cada promoción.
- Medir el circuito sin duplicar checks ni consumir logs completos cuando todo está sano.
- Dejar instrucciones breves, mensajes comprensibles y una matriz de excepciones reusable.

**Non-Goals:**

- Extender schemas, renderizadores, relaciones, navegación o configuración global.
- Probar altas de categorías o servicios, ni cambios de teléfono, WhatsApp o mapa.
- Integrar GitCron, Supabase, redes sociales o modelos locales.
- Reemplazar la aprobación clínica o almacenar evidencia privada de consentimiento.
- Permitir publicación directa desde Tina hacia `main` sin PR, checks y deploy Git.

## Decisions

### 1. Validar sobre contenido existente y aprobado

La actualización visible se elegirá entre contenido ya publicado, con una modificación pequeña, reversible y aprobada. El retiro y la republicación operarán sobre un documento existente sin borrar su JSON. Esto reduce el riesgo clínico y prueba exactamente el mantenimiento cotidiano.

**Alternativa descartada:** crear contenido de prueba. Agregaría ruido público, requeriría más decisiones clínicas y no demostraría la conservación de una pieza real.

### 2. Usar Tina como única superficie operativa del ciclo saludable

El colaborador realizará `Save`, abrirá el Preview y activará `Publicar cambios` desde el panel. GitHub y Netlify se observarán sólo para verificar el resultado o investigar un fallo; no se usarán para completar manualmente un ciclo declarado saludable.

**Alternativa descartada:** crear o mezclar el PR manualmente. Ocultaría defectos de la automatización que este OpenSpec debe validar.

### 3. Ejecutar tres promociones controladas

Se promoverán, en orden: la actualización visible, el retiro y la republicación. Después de cada una se comprobarán request, commit de `main`, deploy y convergencia antes de permitir la siguiente. La republicación devuelve el contenido al estado público original y actúa como rollback funcional del retiro.

### 4. Verificación proporcional y escalonada

Antes de publicar se ejecutará el preflight breve ya versionado. Los checks completos se confiarán al PR técnico sobre la revisión exacta. La producción se verificará por estado del deploy, SHA y rutas representativas; sólo se abrirán logs completos ante fallo, timeout o commit inesperado.

### 5. Evidencia mínima y no sensible

El reporte registrará timestamps, request id, SHAs, resultado de checks, deploy y rutas comprobadas. No copiará logs verdes completos, tokens, rutas privadas, documentos de consentimiento ni datos identificatorios de pacientes.

### 6. Un fallo real no amplía automáticamente el alcance

Si el defecto está dentro del bootstrap —por ejemplo, estado que no se actualiza, request duplicado o convergencia incorrecta— podrá corregirse en esta rama con una tarea y prueba específicas. Si exige schema, contrato, navegación o una nueva capacidad, el ciclo se detendrá y se abrirá otro OpenSpec.

## Risks / Trade-offs

- **[La prueba modifica producción]** → usar cambios reversibles, aprobación previa y tres promociones secuenciales sin solapamiento.
- **[Una pieza retirada afecta enlaces o SEO]** → comprobar ruta canónica, listados, relaciones, sitemap y metadata; republicar antes de cerrar.
- **[TinaCloud indexa un schema distinto]** → confirmar rama y reindexado antes del primer Save; no continuar ante diferencias.
- **[El workflow mezcla un snapshot mayor al esperado]** → mostrar y confirmar el alcance global, ejecutar la allowlist y detenerse ante archivos estructurales.
- **[Se duplica trabajo de validación]** → ejecutar localmente sólo el preflight específico y confiar en CI remoto salvo investigación.
- **[La evidencia expone información clínica]** → conservar sólo identificadores técnicos y confirmaciones humanas no sensibles.
- **[Una corrección del bootstrap crece de alcance]** → aplicar el clasificador `editorial-routine` / `structural-change` antes de editar código.

## Migration Plan

1. Actualizar el roadmap y crear la rama desde `main` sincronizada.
2. Llevar `editorial/tina` al mismo commit base de `main` y confirmar el índice TinaCloud.
3. Elegir y aprobar una modificación visible reversible; guardar y revisar Preview.
4. Publicar desde Tina, esperar el PR técnico, checks, merge y deploy; verificar producción y convergencia.
5. Cambiar la misma pieza o una pieza acordada a `retired`, repetir el circuito y verificar su exclusión pública sin borrado.
6. Volver a `published`, repetir el circuito y verificar la restauración canónica.
7. Consolidar evidencia, guía y matriz de excepciones; completar la validación humana, archive y merge según `AGENTS.md`.

**Rollback:** ante un fallo previo al merge, producción conserva el commit anterior y el contenido queda en Preview. Ante un fallo posterior al merge, no se inicia otro request ambiguo; se identifica el commit publicado y se usa una promoción editorial explícita para restaurar el documento o el procedimiento de recuperación versionado, sin reescribir historial.

## Open Questions

- La pieza y el texto exactos de la actualización visible se seleccionarán al comenzar la ejecución y requerirán aprobación humana aplicable.
- El retiro podrá usar la misma pieza si el impacto sobre enlaces y SEO es aceptable; de lo contrario se elegirá otra pieza publicada de bajo riesgo.
