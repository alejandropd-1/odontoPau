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

### 7. El PR técnico es una barrera interna y no una pantalla para el usuario

Cada tanda conserva un único PR técnico y los checks requeridos sobre el snapshot exacto. El panel traduce su resultado a estados editoriales y nunca exige abrir GitHub. Como el Preview editorial ya existe en `editorial/tina`, el PR técnico llevará la señal oficial para omitir su Deploy Preview de Netlify; crear otra vista previa del mismo snapshot no agrega una decisión humana y consume capacidad innecesaria.

### 8. Los commits de control no reconstruyen el sitio

Los commits que modifican exclusivamente `src/data/editorial/publication-request.json` registran pedido, progreso o resultado y no cambian la web. Netlify los omite mediante un `ignore` versionado y comprobable. Las ediciones reales siguen construyendo el branch deploy de Preview y el merge a `main` sigue iniciando la única compilación de producción.

La misma regla omite una sincronización entre dos commits cuyo árbol público es idéntico. Ante una referencia ausente, un error de comparación o cualquier archivo real modificado, el comportamiento seguro es construir. Los controles de GitHub también esperan primero el check iniciado por el PR y sólo lo disparan manualmente si no apareció, para no ejecutar dos veces la misma suite.

### 9. Publicado significa producción confirmada

El build genera una marca pública no sensible con el SHA servido. Después del merge, la automatización conserva el estado `deploying` hasta que esa marca coincide con el commit integrado. Recién entonces registra `published`. Si la confirmación tarda o falla, bloquea una nueva tanda con `waiting_index` y muestra una instrucción comprensible, sin afirmar un éxito ambiguo.

### 10. Errores orientados a la acción

El usuario ve mensajes coloquiales según la clase de problema: corregir contenido, revisar un snapshot que cambió, esperar la actualización pública o pedir ayuda técnica. Los identificadores del request quedan disponibles sólo como referencia de soporte; los logs y términos como PR, SHA, CI o merge permanecen fuera del recorrido ordinario.

Para la inspección visual previa, el panel ofrece en desarrollo un selector de escenarios que simula los estados sin persistir datos, crear requests ni comunicarse con Netlify. El selector y el bloqueo local de la acción de publicación no se incluyen en el build de producción.

### 11. Estado por contenido y publicación por tanda

El panel puede mostrar el estado y la preparación de cada documento, pero la promoción técnica continúa siendo una única tanda: el snapshot completo revisado en Preview. Por lo tanto, una fila podrá informar `listo para publicar`, `bloqueado`, `publicado` o `retirado`, junto con el motivo y la acción editorial aplicable, sin prometer que se desplegará aislada de los demás cambios aprobados.

La unificación de estas filas operativas pertenece al cambio posterior `operativizar-dashboard-editorial-por-contenido`. Ese cambio trasladará las funciones útiles de la interfaz histórica de `/editorial` al Panel editorial personalizado de Tina dentro de `/admin`; no mantendrá dos dashboards. Después de la migración, la ruta independiente `/editorial` se eliminará o redirigirá a `/admin`.

`/admin` es la única entrada editorial destinada a las personas. La rama `editorial/tina` se conserva como detalle técnico separado porque alimenta Preview y evita que **Save** modifique `main`; su nombre no implica una ruta web `/editorial`. Este OpenSpec sólo valida el motor real que el futuro dashboard consumirá. Supabase no es necesario para esa primera integración y conserva su gate separado para colaboración, KPIs y auditoría avanzada.

## Risks / Trade-offs

- **[La prueba modifica producción]** → usar cambios reversibles, aprobación previa y tres promociones secuenciales sin solapamiento.
- **[Una pieza retirada afecta enlaces o SEO]** → comprobar ruta canónica, listados, relaciones, sitemap y metadata; republicar antes de cerrar.
- **[TinaCloud indexa un schema distinto]** → confirmar rama y reindexado antes del primer Save; no continuar ante diferencias.
- **[El workflow mezcla un snapshot mayor al esperado]** → mostrar y confirmar el alcance global, ejecutar la allowlist y detenerse ante archivos estructurales.
- **[Se duplica trabajo de validación]** → ejecutar localmente sólo el preflight específico y confiar en CI remoto salvo investigación.
- **[Los commits de estado consumen minutos de Netlify]** → omitir únicamente los diffs operativos conocidos y mantener el build normal ante cualquier cambio real o condición no reconocida.
- **[El merge termina antes que el deploy]** → mantener el panel en `deploying` y comprobar la marca pública antes de mostrar éxito.
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
