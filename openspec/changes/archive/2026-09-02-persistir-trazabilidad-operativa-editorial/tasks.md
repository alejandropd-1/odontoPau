## 1. Contrato y línea base

- [x] 1.1 Registrar la línea base del manifiesto, el workflow y el panel editorial antes de modificar código; verificar con las pruebas focalizadas actuales que la solicitud de publicación y la lectura del panel siguen funcionando.
- [x] 1.2 Incorporar en `src/cms/tina/publication.ts` los tipos del historial terminal, los resultados permitidos y la lista cerrada de motivos operativos; verificar con TypeScript y pruebas unitarias que no se aceptan valores fuera del contrato.
- [x] 1.3 Extender la validación del manifiesto para aceptar un historial opcional y conservar compatibilidad con documentos anteriores sin historial; verificar casos de manifiesto legado, historial válido, campos desconocidos y datos sensibles rechazados.
- [x] 1.4 Implementar funciones puras para agregar eventos de forma idempotente, ordenarlos y derivar el resumen; verificar duplicados idénticos, conflictos de un mismo pedido, orden cronológico, último éxito, cantidades y duración.

## 2. Escritura terminal y circuito de publicación

- [x] 2.1 Actualizar la escritura de resultados terminales para guardar en una sola operación el estado vigente y su evento de historial; verificar por pruebas focalizadas los finales `published` y `failed`.
- [x] 2.2 Impedir que los estados transitorios de una publicación agreguen movimientos al historial; verificar que solicitar, controlar y desplegar no generan filas nuevas antes de un resultado terminal.
- [x] 2.3 Conservar la marca pública como autoridad para registrar un éxito; verificar que ningún camino escriba `published` antes de confirmar esa marca y que una ausencia termine como fallo legible.
- [x] 2.4 Mantener el staging selectivo del manifiesto en el workflow y no incorporar servicios, secretos ni dependencias externas; verificar el diff del workflow, `package.json` y el lockfile.
- [x] 2.5 Migrar el manifiesto existente sin inventar movimientos históricos: iniciar vacío o sembrar únicamente el resultado terminal vigente si cumple el contrato; verificar el documento resultante con el validador editorial.

## 3. Lectura segura desde Tina

- [x] 3.1 Agregar al esquema de `publicationrequest` los campos ocultos necesarios para almacenar el historial sin presentarlos como controles editables; verificar en el esquema generado que Tina pueda leerlos y que no aparezcan en el formulario del usuario.
- [x] 3.2 Regenerar los artefactos de Tina con el comando oficial del proyecto; verificar que el diff generado se limite al contrato esperado y no incluya archivos temporales.
- [x] 3.3 Incorporar una lectura aislada del historial para que un dato ausente, parcial o inválido no bloquee el catálogo, la edición ni la publicación general; verificar los tres escenarios con pruebas del modelo del panel.
- [x] 3.4 Transformar el historial técnico en un modelo de vista seguro y coloquial; verificar que no exponga identificadores de pedido, referencias internas, ramas, PR, CI, SHA, GitHub ni Netlify.

## 4. Experiencia del Panel editorial

- [x] 4.1 Mostrar junto a la publicación general un resumen compacto con la última publicación confirmada y las cantidades de resultados exitosos o detenidos; verificar el render con historial completo, parcial y vacío.
- [x] 4.2 Incorporar `Ver movimientos recientes` con cinco movimientos por página y avance explícito; verificar que el panel no cree una sábana infinita y que el orden más reciente sea estable.
- [x] 4.3 Presentar resultados detenidos con una explicación accionable y estados vacíos sin bloquear los controles existentes; verificar textos y acciones mediante pruebas del componente.
- [x] 4.4 Mantener exactamente tres estados visibles por contenido —`Publicado`, `No publicado` y `Borrador`— y no convertir resultados de tandas en nuevas columnas o estados de fila; verificar las vistas de tabla y tarjetas.
- [x] 4.5 Formatear fechas, horas y duraciones para Argentina de manera determinista; verificar ejemplos de mismo día, días distintos, duración disponible y duración ausente.
- [x] 4.6 Conservar la preferencia de tabla o tarjetas, los filtros y la paginación actuales al incorporar el historial; verificar recarga, cambio de vista y navegación entre páginas.
- [x] 4.7 Ajustar el bloque para escritorio y móvil con teclado, foco visible, nombres accesibles y sin desborde horizontal de la página; verificar en anchos representativos y mediante una comprobación focalizada de accesibilidad.
- [x] 4.8 Extender la revisión local del panel con escenarios de historial sin guardar datos ni llamar servicios externos; verificar que cada escenario sea reversible al recargar y que la simulación no invoque Netlify.

## 5. Comprobaciones automáticas de cierre

- [x] 5.1 Ejecutar una sola tanda de pruebas focalizadas del contrato, el script de publicación, el modelo y el panel; verificar que todos los casos nuevos y las regresiones relacionadas terminen en verde.
- [x] 5.2 Ejecutar `pnpm exec tsc --noEmit`; verificar salida exitosa sin errores TypeScript.
- [x] 5.3 Ejecutar `pnpm run lint`; verificar salida exitosa sin advertencias nuevas atribuibles al cambio.
- [x] 5.4 Ejecutar una única vez `pnpm run build` al cierre; verificar que la compilación de producción termine correctamente sin disparar una publicación externa.
- [x] 5.5 Ejecutar `openspec validate persistir-trazabilidad-operativa-editorial --strict`; verificar que proposal, design, specs y tareas permanezcan alineados.
- [x] 5.6 Ejecutar `git diff --check` y revisar el staging selectivo; verificar que no se incluyan `.codex-remote-attachments`, capturas, salidas de Playwright, secretos, datos de pacientes ni cambios ajenos.

## 6. Validación humana

- [x] 6.1 Con autorización explícita, preparar una única vista desplegada o equivalente para la revisión final y registrar su evidencia sin consultas repetidas a Netlify; verificar que no se publique a producción en este paso.
  - Evidencia local autorizada por Alejandro el 02/09/2026: revisión del Panel editorial en Tina local a 1440 × 1000 px y 390 × 844 px, sin desborde horizontal de la página; `Ver movimientos recientes` recibió foco y se abrió con teclado; se mostraron cinco movimientos inicialmente y siete después de `Ver 5 más`. No se ejecutó ningún deploy ni consulta a Netlify y las capturas quedaron sólo como artefactos locales excluidos del staging.
- [x] 6.2 Alejandro valida manualmente en escritorio y móvil la comprensión del resumen, los movimientos, la paginación, los tres estados por contenido y la ausencia de lenguaje técnico; este último checkbox lo marca exclusivamente Alejandro.
