## Context

El circuito remoto ya confirma una tanda mediante `publication-request.json`: Tina guarda en `editorial/tina`, el panel solicita la publicación, los gates verifican el snapshot, `main` se integra y la misma solicitud informa cuándo producción quedó confirmada. El Panel editorial consulta Artículos e Instrucciones desde Tina, pero hoy sólo muestra contadores, seis totales por estado y ocho enlaces recientes. El dashboard independiente `/editorial` tiene inventario, filtros y tabla, aunque trabaja sólo con el contenido compilado, duplica navegación y conserva autenticación propia ajena a Tina.

La prueba de retiro/republicación mostró dos límites de producto. Primero, el valor `status` de la rama editorial no alcanza para afirmar qué está público: un documento puede estar preparado en Preview mientras producción conserva la versión anterior. Segundo, el router visual de una pieza retirada conduce correctamente al 404 público, pero esa ruta no sirve como entrada para editarla. La interfaz debe separar edición, Preview y producción sin exponer la implementación Git.

## Goals / Non-Goals

**Goals:**

- Hacer del Panel editorial dentro de `/admin` la única superficie operativa.
- Presentar todos los Artículos e Instrucciones en una lista responsive con búsqueda, filtros, un estado cotidiano unificado, explicación de pendientes y acciones válidas.
- Derivar el estado público de la última tanda confirmada, no sólo del valor presente en Preview.
- Mantener una única acción de publicación global para el snapshot completo.
- Simplificar los estados visibles en el perfil de profesional único sin debilitar contratos, aprobaciones ni compatibilidad colaborativa.
- Retirar la ruta, autenticación y código del dashboard histórico cuando ya no tengan consumidores.

**Non-Goals:**

- Crear despliegues, requests o ramas por contenido.
- Reemplazar JSON + Git con Supabase o introducir persistencia de KPIs, responsables o auditoría avanzada.
- Migrar trazabilidad de Drive, generación de copys sociales o exportaciones del panel histórico.
- Cambiar contenido clínico, consentimiento, relaciones públicas o reglas SEO.
- Reemplazar la automatización de publicación ya validada.

## Decisions

### 1. Una sola pantalla Tina con lista operativa adaptable

Se ampliará `tina/dashboard/EditorialDashboard.tsx` y se separarán modelos puros/componentes cuando el tamaño lo justifique. La vista principal recuperará la jerarquía visual útil del dashboard histórico con tarjetas dinámicas y permitirá alternar a una tabla semántica, recordando esa preferencia en el mismo navegador. Las tarjetas se adaptarán a pantallas angostas; cuando una persona elija explícitamente `Tabla`, ésta conservará sus columnas y habilitará desplazamiento horizontal con controles laterales visibles sólo cuando haya columnas ocultas. Tendrá búsqueda, orden y filtros por tipo y estado cotidiano. Cada pieza mostrará sus fechas editoriales guardadas, resumen y etiquetas, una única síntesis de estado, una explicación `Qué pasa` y sus acciones. La lista se paginará de a seis piezas por defecto, con opciones acotadas para ampliar la página, y conservará el mismo tramo al alternar entre tarjetas y tabla. Las tarjetas de acceso a páginas no editoriales permanecerán como accesos secundarios compactos, pero Artículos e Instrucciones se operarán desde la lista completa, no desde un conteo ni sólo desde “recientes”. La simulación local quedará plegada como herramienta de prueba y la publicación global se presentará en forma compacta porque afecta a la tanda completa, no a una pieza aislada.

Alternativa descartada: incrustar `src/components/EditorialDashboard.tsx`. Ese componente depende del runtime público de Next, incluye Drive/redes/exportaciones fuera de alcance y no conoce la rama Tina ni la publicación confirmada.

### 2. Índice mínimo de la última producción confirmada

El documento operativo de publicación conservará un índice oculto y no sensible de la última tanda confirmada; por pieza incluirá solamente identidad estable, una huella de revisión y presencia/estado público resultante. El workflow calculará ese índice desde la revisión exacta que llegó a producción, guardándolo junto con el resultado final antes de declarar convergencia. La huella se deriva de la colección, la ruta estable, el estado y `updatedAt`, que Tina actualiza automáticamente en cada guardado, sin agregar metadatos nuevos a los JSON clínicos.

El panel comparará cada documento actual con ese índice:

- huella coincidente y presencia pública: `Ya está publicado`;
- huella coincidente y estado retirado: `Retirado del sitio`;
- huella diferente o pieza nueva: `Sólo en vista previa`;
- solicitud global activa: conservará el estado por contenido y añadirá `La tanda se está publicando`, sin afirmar éxito anticipado;
- índice ausente, antiguo o inconsistente: `No pudimos confirmar el estado público` y bloqueo de una nueva interpretación optimista.

La huella se calculará en una utilidad compartida y determinista sobre la identidad y revisión del documento. `beforeSubmit` actualizará `updatedAt` en cada guardado, de modo que el panel compare versiones consultando sólo metadatos editoriales y no descargue el cuerpo clínico completo. Las ediciones directas fuera de Tina deberán conservar la regla existente de actualizar `updatedAt`; el circuito cotidiano se realiza desde Tina. No se expondrán commits, ramas ni hashes en la interfaz.

Alternativas descartadas: inferir producción desde `status` confunde Preview con sitio público; consultar cada URL no distingue una versión anterior con la misma ruta; llamar a GitHub desde el navegador agregaría credenciales, límites y terminología innecesarios.

### 3. Preparación por fila, publicación por tanda

Cada fila derivará un resultado puro a partir de la preparación editorial y la producción confirmada. La interfaz lo condensará en un único `Estado` con sólo tres valores: `Publicado`, `No publicado` o `Borrador`. `Qué pasa` mostrará cambios sin publicar, una actualización en curso, falta de confirmación, requisitos pendientes y la acción segura sin convertir esos procesos en nuevos estados. Así, una pieza cuya versión anterior sigue pública conserva `Publicado` mientras `Qué pasa` aclara que hay cambios todavía no publicados. Si todavía no existe evidencia suficiente para afirmar uno de los tres estados, la celda queda neutra y la explicación evita una afirmación falsa. `Editar` siempre abrirá el formulario Tina por `relativePath`. `Revisar vista previa` sólo se ofrecerá cuando exista una ruta renderizable en Preview; para retirados, la acción principal será el formulario, evitando el 404 visual. Preparar publicación, retiro o republicación modificará el estado desde el formulario Tina; el dashboard no enviará mutaciones parciales que puedan sobrescribir campos.

El botón global conservará la confirmación de Preview y aprobaciones aplicables. Ninguna acción de fila disparará el workflow ni prometerá que el cambio ya está en producción.

Alternativa descartada: mutar el documento directamente desde la tabla. Tina requiere el payload completo del modelo y una edición parcial desde el dashboard aumentaría el riesgo de pérdida o defaults accidentales.

Evolución futura fuera de este alcance: evaluar un switch por fila para elegir `Publicado` o `No publicado`. Ese control podría preparar el valor editorial, pero no publicaría la fila de manera aislada ni reemplazaría la confirmación de la tanda; requiere un OpenSpec propio para definir guardado, validaciones, accesibilidad y recuperación ante errores.

### 4. Perfil visible simple con contrato editorial completo

Se incorporará una configuración explícita de presentación `solo` o `collaborative`. Para OdontoPau, `solo` mostrará como opciones ordinarias `Borrador`, `Publicado` y `Retirado`; la profesional confirma sus propias revisiones aplicables dentro del mismo documento. El perfil `collaborative` conservará las seis etapas actuales. Los validadores y tipos seguirán aceptando todos los valores históricos, y un documento existente en un estado intermedio nunca será descartado ni reescrito automáticamente.

La simplificación sólo afecta la experiencia y las transiciones ofrecidas. `published` continuará exigiendo responsable clínico, fecha y cualquier confirmación de imágenes aplicable; los gates técnicos y visuales siguen perteneciendo a la publicación de la tanda.

Alternativa descartada: borrar los estados intermedios del contrato. Eso rompería contenido existente y limitaría la reutilización del circuito en instalaciones con más de una persona.

### 5. Retiro del dashboard histórico mediante redirección y limpieza selectiva

`/editorial` y `/editorial/login` redirigirán a `/admin` durante la migración para preservar marcadores. Una vez cubierta la navegación, se eliminarán el componente, estilos y endpoints de sesión exclusivos que queden sin uso. La redirección no mantendrá una segunda contraseña ni mostrará datos editoriales fuera de TinaCloud.

Alternativa descartada: mantener ambos paneles. Prolongaría estados contradictorios, duplicaría mantenimiento y dejaría una superficie de autenticación adicional.

### 6. Validación local antes de cualquier infraestructura remota

Las reglas de derivación, filtros, URLs y perfil editorial tendrán pruebas focalizadas. El selector local ya existente se extenderá para revisar combinaciones de estado público y bloqueos sin guardar ni publicar. Después se ejecutarán TypeScript, lint, build, validaciones CMS/OpenSpec y revisión responsive/accesible. No se creará un PR intermedio: sólo se evaluará un único PR final si hace falta el gate protegido o un Preview compartido antes de integrar a `main`.

## Risks / Trade-offs

- [El índice operativo queda desfasado después de un fallo parcial] → Escribirlo sólo desde la revisión exacta confirmada en producción y tratar toda inconsistencia como estado desconocido, nunca como éxito.
- [Una edición directa fuera de Tina no actualiza la revisión] → Mantener `updatedAt` como contrato obligatorio, actualizarlo automáticamente desde Tina y validar su presencia antes de construir el índice.
- [El perfil simple oculta un estado histórico] → Mostrar el valor actual como transición heredada y pedir elegir un estado ordinario al siguiente guardado, sin mutación automática.
- [La lista completa crece] → Filtrar en memoria sobre el catálogo Tina actual, paginar el resultado visible y evitar otra base de datos prematura.
- [Redirigir `/editorial` rompe un marcador interno] → Usar redirección explícita a `/admin`, buscar consumidores y conservar rollback mediante la rama hasta verificar navegación.
- [La interfaz promete preparación clínica basada sólo en campos] → Mostrar únicamente requisitos verificables del contrato y mantener la confirmación humana global; no inferir consentimiento ni criterio clínico.

## Migration Plan

1. Agregar utilidades y contrato del índice productivo con compatibilidad para el documento operativo actual sin índice.
2. Extender el workflow para producir y persistir el índice sólo al confirmar producción; probarlo sin ejecutar publicaciones reales.
3. Construir la derivación por contenido y la lista operativa dentro del Panel Tina.
4. Activar el perfil `solo` de OdontoPau y conservar el modo `collaborative` verificable.
5. Redirigir rutas históricas y eliminar únicamente consumidores, estilos y endpoints comprobados como exclusivos.
6. Ejecutar validaciones focalizadas, tanda completa local y revisión humana. Crear un único PR/Preview final sólo si el gate técnico de integración lo requiere y con autorización.
7. Tras el merge autorizado, verificar `/admin`, la redirección histórica y una muestra publicada/retirada. Ante falla, revertir el commit estructural; el contenido y el circuito editorial existente permanecen intactos.

## Open Questions

No quedan decisiones de producto bloqueantes. Durante la implementación se verificará si Tina permite inyectar la configuración de perfil sin regenerar ruido en `tina-lock.json`; si no, se resolverá mediante una constante tipada propia del sitio, conservando el mismo contrato observable.
