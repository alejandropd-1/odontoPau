## Context

El circuito vigente usa `src/data/editorial/publication-request.json` como manifiesto de una única solicitud. El Panel editorial lo consulta mediante Tina GraphQL y el workflow actualiza ese mismo documento durante `pending`, controles, integración, espera de la marca pública y resultado final. Cuando una solicitud nueva reemplaza esos campos, el resultado anterior sólo queda reconstruible desde Git o desde registros técnicos externos que la usuaria no debe conocer.

El cambio cruza contratos TypeScript, schema Tina, script de publicación, workflow y pantalla custom. Debe conservar el comportamiento validado en `operativizar-dashboard-editorial-por-contenido`: un solo `/admin`, tres estados visibles por pieza, publicación por tanda y Git como autoridad pública.

## Goals / Non-Goals

**Goals:**

- Persistir resultados finales de publicación sin sumar infraestructura ni autenticación.
- Hacer idempotente el registro por solicitud y separar el dato almacenado del texto presentado.
- Ofrecer una lectura breve de movimientos recientes y un resumen derivado dentro del Panel editorial.
- Mantener el dashboard operativo si el historial falta o una entrada no es utilizable.

**Non-Goals:**

- Convertir el historial en un sistema de auditoría regulatoria o multiusuario.
- Registrar cada guardado de Tina, identificar actores individuales o modelar asignaciones.
- Cambiar los estados editoriales, las reglas clínicas o la unidad de publicación.
- Incorporar Supabase, Realtime, una API de métricas o un segundo login.
- Implementar redes sociales o publicación individual por fila.

## Decisions

### 1. Extender el manifiesto editorial existente

`publication-request.json` incorporará una lista opcional `history`. Cada entrada tendrá un contrato reducido:

- `requestId` interno;
- `requestedAt` y `processedAt` en ISO 8601;
- `result`: `published` o `failed`;
- `issueKind` opcional y limitado al enum ya validado;
- `productionCommit` opcional para correlación interna de resultados exitosos.

No se guardará una descripción libre. El modelo del dashboard derivará el mensaje cotidiano a partir de `result` e `issueKind`, evitando que el archivo acepte datos clínicos o copie detalles de infraestructura.

Mantener el historial en el manifiesto evita una segunda colección visible en Tina y aprovecha el archivo que el workflow ya valida, modifica y prepara selectivamente. La alternativa de un archivo o colección separados agregaría otra fuente operativa y otra consulta sin aportar aislamiento real para el volumen actual.

### 2. Registrar sólo transiciones terminales

Los estados `pending`, `processing`, `deploying` y `waiting_index` continuarán describiendo la solicitud actual y no crearán historial. `published` y `failed` agregarán exactamente una entrada cuando el resultado quede asentado.

La inserción buscará primero `requestId`:

- si no existe, agregará la entrada;
- si existe con el mismo resultado, devolverá el documento sin duplicar;
- si existe con un resultado incompatible, rechazará la escritura para preservar la evidencia previa.

La confirmación exitosa seguirá ocurriendo únicamente después de comprobar la marca pública. Una integración o deploy iniciado no será suficiente para producir un evento `published`.

### 3. Actualizar solicitud e historial como una sola unidad Git

El script calculará el nuevo manifiesto completo en memoria, lo validará y realizará una única escritura atómica del JSON. El workflow continuará preparando selectivamente `publication-request.json`, por lo que el estado actual y su entrada histórica viajarán en el mismo commit operativo.

Git conservará las revisiones del manifiesto como respaldo completo. No se introduce poda automática en este cambio: el volumen esperado es bajo y eliminar entradas para limitar tamaño debilitaría el contrato de persistencia. Si el uso futuro justificara archivado o agregaciones, deberá abrirse otro OpenSpec con evidencia de volumen real.

### 4. Consultar el historial de forma aislada

El dashboard mantendrá su consulta principal de catálogo y solicitud actual. El campo histórico se obtendrá y validará mediante una consulta separada o una capa de lectura aislada, para que un error histórico no impida cargar contenidos, estados ni el botón de publicación.

El modelo puro ordenará entradas válidas por `processedAt` descendente y derivará:

- fecha de la última publicación confirmada;
- cantidad de ciclos confirmados;
- cantidad de ciclos detenidos;
- duración de cada ciclo cuando ambas fechas sean coherentes.

No se persistirán contadores derivados. Así se evita que resumen e historial diverjan.

### 5. Integrar una sección compacta, no nuevas columnas

La pantalla conservará la tabla y las tarjetas existentes. Cerca del bloque de publicación se mostrará un resumen breve y un control `Ver movimientos recientes`. Al abrirlo aparecerán cinco ciclos por vez, con una acción para mostrar el siguiente grupo, evitando una sábana infinita.

Los textos serán del tipo `Los cambios ya están publicados` o `La publicación se detuvo`, acompañados por fecha argentina y una explicación traducida desde `issueKind`. `requestId`, `productionCommit`, ramas, PR, CI, GitHub y Netlify no se renderizarán.

Esta sección representa acontecimientos de la tanda. No participa del filtro por estado ni altera `Publicado`, `No publicado` o `Borrador` en cada contenido.

### 6. Mantener Tina como única puerta de acceso

La sección vive en la custom screen existente y hereda el acceso de TinaCloud. No se agregan Supabase Auth, middleware de sesión ni roles paralelos.

Se consideró Supabase para eventos append-only y métricas, pero se descarta en esta fase: una operación individual y de bajo volumen no compensa otro modelo de identidad, RLS, secretos, sincronización ni consumo. La decisión puede revisarse si aparecen varios operadores, asignaciones o consultas históricas que Git no pueda resolver razonablemente.

### 7. Migración compatible hacia adelante

`history` será opcional al leer documentos existentes y se normalizará como lista vacía. Si el manifiesto actual contiene un resultado terminal válido, la migración inicial podrá conservarlo como primera entrada usando sus fechas e identificador reales; no se inventarán ciclos anteriores.

El schema Tina ocultará los campos técnicos de cada entrada para impedir edición manual desde la interfaz. Los validadores seguirán siendo la autoridad del contrato tanto en local como en CI.

## Risks / Trade-offs

- **[El archivo crece con cada publicación]** → Se acepta por el volumen bajo y porque evita pérdida de historia; se medirá antes de diseñar poda o una base externa.
- **[Un reintento duplica el evento]** → La clave idempotente será `requestId` y los resultados incompatibles se rechazarán.
- **[Una falla impide guardar su propio registro]** → La escritura de fallo seguirá siendo best effort; la solicitud actual y los logs técnicos continúan siendo la fuente de recuperación, y el panel no afirmará que existe un evento ausente.
- **[La referencia interna se filtra en la UI]** → Los componentes recibirán un view model sin campos técnicos y las pruebas verificarán el vocabulario prohibido.
- **[El historial se confunde con aprobación clínica]** → La sección hablará de tandas publicadas o detenidas y permanecerá separada de los estados y controles clínicos por pieza.
- **[Una entrada inválida rompe todo el panel]** → La lectura histórica se aislará y degradará de forma independiente.

## Migration Plan

1. Incorporar tipos y validadores opcionales para `history`, manteniendo válidos los manifiestos actuales.
2. Agregar pruebas de parseo, idempotencia, orden, resumen y rechazo de datos fuera de contrato.
3. Actualizar los escritores terminales y verificar que solicitud e historial se escriben juntos.
4. Incorporar el campo oculto al schema Tina y regenerar el lock/schema correspondiente.
5. Migrar únicamente el resultado terminal vigente cuando sus datos permitan una entrada real.
6. Integrar la consulta aislada y la sección visual en el Panel editorial.
7. Verificar localmente escenarios vacío, éxito, fallo, duplicado, dato inválido, escritorio y móvil.
8. Ejecutar los controles completos una sola vez al cierre y detenerse en la aprobación visual humana.

Rollback: la lectura nueva es opcional. Ante una regresión se puede retirar la consulta y la sección del dashboard conservando `history` en el JSON; el circuito vigente seguirá usando los campos superiores de la solicitud. No se eliminarán eventos ya registrados durante un rollback.
