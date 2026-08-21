## Context

Producción ya sirve el admin de Tina configurado sobre `editorial/tina`, y la guarda de seguridad del repositorio rechaza `main` y `master` como ramas del CMS remoto. Los artículos e instrucciones ya poseen estados editoriales y producción sólo renderiza `published`. El primer release real también demostró que, después de integrar, `editorial/tina` debe converger con `main` para evitar un schema remoto desactualizado.

El requisito nuevo no es el Editorial Workflow pago de TinaCloud. Es una capa operativa propia para dos colaboradores confiables del proyecto: guardar siempre en staging/Preview y publicar el snapshot mediante una orden explícita dentro de Tina.

## Goals / Non-Goals

**Goals:**

- Hacer que todos los colaboradores autorizados puedan editar, publicar y retirar.
- Mantener una separación inequívoca entre `Save` y `Publicar cambios`.
- Dar un Preview estable y compartible de la rama editorial.
- Integrar automáticamente sólo snapshots editoriales válidos y convergentes.
- Mantener producción sin cambios cuando cualquier gate falla.
- Reducir la intervención de Alejandro, Codex y herramientas técnicas al manejo de excepciones.

**Non-Goals:**

- Implementar control de permisos por campo o distinguir Admin de Editor para publicar.
- Adoptar el Editorial Workflow pago de TinaCloud.
- Publicar cambios de código desde Tina.
- Eliminar PR, CI o trazabilidad Git del backend; sólo se ocultan de la experiencia editorial.
- Dar autoridad de release a GitCron o a un modelo local dentro de este cambio.

## Decisions

### 1. `editorial/tina` es staging persistente

El admin remoto MUST escribir en `editorial/tina`. Cada `Save` crea un commit editorial y el branch deploy de Netlify representa el Preview. Guardar no crea una publicación ni modifica `main`.

La rama no se recrea por documento. Este diseño coincide con Tina Free y con la configuración ya desplegada.

### 2. Todos los colaboradores pueden publicar

No se implementará una segunda autorización técnica por rol. Acceder al proyecto de Tina implica autoridad para editar, solicitar publicación y retirar contenido. La responsabilidad clínica continúa siendo una política humana del equipo, no una restricción del proveedor.

### 3. Publicar es una acción separada de guardar

El panel editorial tendrá un control `Publicar cambios`. La acción crea una solicitud versionada de un solo uso con identificador y fecha. No se inferirá intención de publicación a partir de un `Save`, porque un documento ya publicado puede recibir múltiples ajustes de Preview antes de estar listo.

El control deberá explicar que publica el snapshot completo de `editorial/tina`, no sólo la pantalla abierta.

### 4. Retirar es estado, no borrado

Se agrega `retired` a artículos e instrucciones. Producción continúa mostrando únicamente `published`; Preview permite inspeccionar también estados no publicados. Retirar requiere guardar el estado y luego publicar el snapshot, del mismo modo que una alta o corrección.

### 5. Solicitud singleton y de un solo uso

Un documento interno no renderizado registra:

- si hay una solicitud pendiente;
- identificador único;
- fecha de solicitud;
- último identificador procesado;
- fecha y resultado resumido del último proceso.

El workflow sólo actúa cuando aparece un identificador pendiente distinto del último procesado. Antes de integrar, consume la solicitud y deja el control nuevamente en reposo para evitar repeticiones.

### 6. Allowlist y convergencia antes de integrar

La automatización calcula el diff `main...editorial/tina`. Sólo admite contenido Tina, medios públicos usados por el CMS, el singleton de publicación y artefactos generados expresamente permitidos. Código, OpenSpec, dependencias, workflows, configuración o rutas fuera de lista bloquean la publicación automática.

Además, `main` debe ser ancestro de `editorial/tina`. La divergencia nunca se resuelve con force-push ni merge automático ambiguo.

### 7. CI integra en representación del colaborador

Ante una solicitud válida:

1. comprueba el request y el alcance;
2. ejecuta los gates editoriales y de aplicación vigentes;
3. crea o actualiza un PR técnico trazable;
4. integra a `main` si todos los gates pasan;
5. adelanta `editorial/tina` por fast-forward hasta el nuevo `main`;
6. espera el reindexado/deploy mediante estados observables.

La interfaz editorial no expone GitHub o Netlify. Si el repositorio no permite que `GITHUB_TOKEN` cree o mezcle PR, el workflow falla con una instrucción administrativa y no altera producción.

### 8. Fallo seguro y estado comprensible

Ante error, la solicitud permanece identificable como fallida, producción conserva su commit anterior y el dashboard muestra que los cambios siguen sólo en Preview. Reintentar genera un nuevo request o reanuda explícitamente el fallido; no se publican commits parciales.

### 9. Verificación proporcional

Los cambios locales ejecutan pruebas específicas del contrato y del workflow. El PR ejecuta los gates completos una vez. Los logs de Netlify sólo se inspeccionan ante fallo, timeout o commit inesperado.

## Risks / Trade-offs

- [Dos personas editan al mismo tiempo] → el botón publica el snapshot completo y lo declara explícitamente; el piloto comienza con una tanda editorial por vez.
- [Borradores adicionales en la rama] → la revisión previa muestra el snapshot completo y la allowlist verifica los estados; contenido no `published` no renderiza en producción, pero los medios clínicos requieren revisión antes de promover la rama.
- [Workflow sin permiso de merge] → falla antes de modificar `main` y deja instrucciones de configuración para el administrador.
- [Request duplicado] → identificador de un solo uso y comparación contra el último procesado.
- [Schema remoto demora] → estado `waiting-index`; producción previa continúa activa.
- [Cambio estructural disfrazado de editorial] → allowlist cerrada y bloqueo automático.

## Migration Plan

1. Actualizar specs, tareas y contratos editoriales.
2. Agregar `retired`, el singleton y sus pruebas.
3. Incorporar el control y los estados al dashboard de Tina.
4. Implementar el preflight y el workflow de publicación sin activarlo externamente todavía.
5. Validar localmente schema, contratos, TypeScript y workflow.
6. Con autorización de Alejandro, publicar la rama en Draft PR y probar Preview.
7. Ejecutar dos ciclos editoriales reales antes del gate humano final.
8. Archivar y mezclar mediante el circuito OpenSpec vigente.

Rollback: deshabilitar el workflow y ocultar el control de publicación. Tina continúa guardando en `editorial/tina`; el procedimiento manual por PR sigue disponible sin perder contenido.

## Open Questions

- URL definitiva del branch deploy que se mostrará como Preview en Tina.
- Si GitHub permite al `GITHUB_TOKEN` del repositorio crear y mezclar el PR automático o necesita habilitarse una opción administrativa.
- Qué dos cambios reales se utilizarán para validar publicación y retiro.
