## Why

La validación real del circuito Tina confirmó que la publicación por tanda funciona, pero también mostró que el panel actual no permite comprender ni operar cada contenido con suficiente claridad: mezcla estado editorial con estado público, oculta los motivos de bloqueo y puede llevar a una vista 404 cuando una pieza está retirada. El dashboard histórico de `/editorial` duplica la experiencia y conserva funciones separadas de la entrada canónica `/admin`, por lo que ahora corresponde concentrar la operación cotidiana en un único Panel editorial comprensible para profesionales no técnicos.

## What Changes

- Convertir el Panel editorial personalizado de Tina en una lista operativa por contenido, con título, tipo, categoría, un estado cotidiano que sintetice la preparación y la confirmación pública, y un motivo claro cuando exista una transición o bloqueo.
- Incorporar en cada fila acciones seguras para editar, revisar la vista previa y aplicar el cambio editorial que corresponda, evitando que una pieza retirada abra una ruta pública inexistente.
- Mantener explícitamente la publicación como una única tanda aprobada: las filas preparan y explican el snapshot, mientras `Publicar cambios` continúa promoviendo el conjunto completo visto en Preview.
- Simplificar la experiencia visible para la instalación operada por la propia profesional, sin obligarla a simular traspasos entre revisión clínica, técnica y aprobación. El contrato conservará las aprobaciones clínicas y de imágenes aplicables y permitirá mantener el flujo ampliado en instalaciones con colaboradores diferenciados.
- Diferenciar con lenguaje inequívoco los estados `sólo en vista previa`, `publicando en el sitio` y `ya publicado`, tanto a nivel de tanda como de contenido, sin exponer ramas, PR, CI, SHA, merge, GitHub ni Netlify.
- Absorber únicamente las funciones útiles del dashboard histórico en el Panel editorial de `/admin` y retirar su experiencia paralela mediante eliminación o redirección segura de `/editorial`, incluyendo su acceso propio cuando deje de ser necesario.
- Asegurar uso responsive, por teclado y con lector de pantalla, incluyendo estados que no dependan sólo del color y acciones con nombres comprensibles.

### Alcance

- Artículos e Instrucciones gestionados por Tina y almacenados como JSON versionado.
- Panel editorial personalizado, reglas de presentación y preparación editorial, navegación interna y rutas heredadas de `/editorial`.
- Validaciones focalizadas del modelo operativo y revisión visual responsive antes del cierre.

### Fuera de alcance

- Publicación o despliegue independiente por fila; la unidad de promoción continúa siendo la tanda completa aprobada.
- Supabase, asignaciones, KPIs, auditoría operativa persistente o el cambio estacionado `dinamizar-dashboard-editorial-con-supabase`.
- Redes sociales, Google Drive, LM Studio, GitCron o automatizaciones ajenas al circuito Tina ya validado.
- Cambios de contenido clínico, imágenes clínicas, contratos editoriales nuevos o configuración global del sitio.
- Exponer herramientas o terminología técnica del recorrido interno a la persona que administra el contenido.

### Riesgos clínicos

- La simplificación visual no puede inferir aprobación clínica, consentimiento de imágenes ni aptitud para publicar: cuando correspondan, esas confirmaciones humanas siguen siendo obligatorias y el panel debe mostrar el bloqueo.
- El estado público debe derivarse del contenido efectivamente promovido y no sólo del valor editado en Preview, para evitar presentar una pieza como publicada o retirada antes de que producción lo confirme.
- Ninguna acción de fila podrá borrar documentos ni publicar por sí sola; el retiro continuará siendo reversible y la promoción exigirá la confirmación explícita de la tanda.

### Criterio de éxito

- Una profesional puede encontrar cualquier Artículo o Instrucción desde `/admin`, entender qué se ve en Preview y qué está realmente público, conocer qué falta y editar o revisar la pieza sin abandonar el circuito cotidiano.
- Una pieza retirada permanece accesible para edición sin conducir a un 404, y puede prepararse para republicación sin duplicar su documento.
- El panel comunica claramente la preparación por contenido y el progreso global de publicación; la promoción final conserva un único snapshot y los gates vigentes.
- `/editorial` deja de competir como segundo dashboard, y la experiencia resultante supera las validaciones focalizadas, responsive, accesibles y humanas previstas por el OpenSpec.

## Capabilities

### New Capabilities

Ninguna. El cambio operativiza y consolida capacidades editoriales ya existentes.

### Modified Capabilities

- `dashboard-editorial`: trasladar el inventario útil al Panel editorial de Tina, convertirlo en una lista operativa por contenido y retirar la experiencia paralela de `/editorial`.
- `piloto-operacion-editorial-tina`: distinguir preparación individual y estado público de la publicación global por tanda, con acciones válidas para piezas publicadas, retiradas o bloqueadas.
- `flujo-editorial-clinico`: permitir una presentación simplificada para la profesional que opera su propio sitio sin debilitar las aprobaciones clínicas, de imágenes y técnicas que resulten aplicables.

## Impact

- Panel personalizado y configuración de Tina bajo `tina/` y `src/cms/tina/`.
- Lectura y validación de Artículos e Instrucciones JSON, sin cambiar su autoridad canónica ni incorporar una base de datos.
- Componentes, estilos, autenticación y rutas del dashboard histórico bajo `src/app/editorial`, `src/components` y `src/styles` que resulten reemplazados o redirigidos.
- Pruebas focalizadas del dashboard, reglas editoriales, estados público/Preview, retiro reversible, accesibilidad y navegación.
- No se agregan servicios externos ni dependencias de producción; tampoco se crea un PR durante la definición o el trabajo local.
