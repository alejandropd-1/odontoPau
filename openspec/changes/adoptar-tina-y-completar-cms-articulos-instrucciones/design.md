## Context

OdontoPau publica desde Next.js 15 en Netlify y obtiene el contenido público desde JSON versionado bajo `src/data`. El cambio archivado `alinear-contratos-y-seguridad-cms` dejó un manifest neutral de 188 rutas, validadores, fixtures, comparadores estructurales y una fotografía del adaptador Stackbit. Esa base permite cambiar el editor sin migrar el contenido a una base propietaria.

El programa activo `hacer-sitio-autoadministrable-desde-cms` fue redactado para Stackbit/Netlify Visual Editor y agrupa 96 tareas. No se aplicará como un bloque: este cambio reemplaza su decisión de proveedor y entrega el primer slice funcional para `Articulo` e `Instruccion`. Los slices de tratamientos/casos y portada/institucionales permanecen posteriores.

La referencia local `Portfolio_2026_astro` demuestra que Tina admite colecciones, campos agrupados, labels, opciones, validaciones, rutas editoriales y una pantalla custom. Se reutiliza el patrón conceptual, no su schema MDX ni su integración Astro. En OdontoPau, Tina será una capa de autoría sobre los JSON existentes y el sitio público seguirá leyendo los archivos locales mediante sus loaders actuales.

Intervienen Alejandro como administrador, auditor visual y autoridad de merge; Paula como autoridad clínica y de imágenes; TinaCloud como backend de edición; GitHub/GitCron como revisión e integración; y Netlify como preview y producción. La solución inicial debe caber en el plan gratuito de Tina y no depender de su Editorial Workflow pago.

## Goals / Non-Goals

**Goals:**

- Adoptar TinaCMS sin cambiar URLs, diseño, loaders públicos ni contenido aprobado.
- Habilitar creación, edición y ampliación sin pérdida de Artículos e Instrucciones y todos sus módulos admitidos.
- Reutilizar el contrato neutral y exigir paridad/round-trip específicos de Tina antes de permitir escritura.
- Entregar un `/admin` protegido, en español y orientado a personas no técnicas.
- Mantener toda edición fuera de `main` hasta Draft PR, CI, preview y aprobaciones humanas.
- Mantener JSON + Git como fuente canónica y Netlify como hosting.
- Dejar una arquitectura replicable, con un proyecto Tina independiente por sitio web.

**Non-Goals:**

- Editar tratamientos, profesionales, casos, portada o institucionales en este slice.
- Reemplazar Git por TinaCloud como fuente canónica o hacer que el sitio público dependa en runtime de la API de Tina.
- Incorporar un page builder, permitir cambios de diseño desde el CMS o exponer constantes técnicas innecesarias.
- Automatizar redes sociales, Supabase, LM Studio o publicación sin aprobación.
- Depender de Editorial Workflow Business/Enterprise, implementar multi-tenant o autogestionar clientes externos en este cambio.

## Decisions

### 1. TinaCMS será un adaptador de autoría; JSON + Git seguirá siendo la fuente de verdad

`tina/config.ts` modelará directamente las carpetas JSON existentes. Los loaders de producción continuarán leyendo `src/data`; no se reemplazarán por consultas remotas a Tina. Así, una indisponibilidad de Tina afecta la edición pero no el sitio público, y el rollback sigue siendo un revert de Git.

**Alternativas consideradas:** Sanity aportaría una plataforma madura pero movería la fuente canónica a un datastore externo; continuar con Stackbit conservaría código existente pero no la experiencia elegida; self-hosting de Tina agregaría autenticación, base de índice y operación innecesarias para el piloto.

### 2. TinaCloud administrará autenticación, con un proyecto independiente para OdontoPau

Alejandro será administrador del proyecto y los futuros editores se agregarán solo a ese proyecto. `NEXT_PUBLIC_TINA_CLIENT_ID` podrá ser público; tokens de build y cualquier secreto existirán únicamente en variables de entorno de Netlify/Tina/GitHub. El schema, la lista de variables y el procedimiento de alta se versionarán sin valores.

El diseño permitirá replicar la arquitectura en otros repositorios, pero no compartirá contenido, tokens, roles ni paneles entre proyectos.

### 3. Tina no publicará ni mezclará directamente a `main`

El plan gratuito no se usará como motor de PR. En local, Tina trabajará sobre el filesystem. En Deploy Preview o Branch Deploy, el admin apuntará a la rama exacta de revisión. Si se expone `/admin` desde producción, una variable explícita deberá apuntarlo a una rama editorial no productiva; CI fallará si una configuración de escritura resuelve `main`.

GitCron/GitHub continuará creando o mostrando el Draft PR, ejecutando CI, recibiendo el Deploy Preview y realizando el merge autorizado. Seleccionar `published` en un formulario no publica por sí solo: el cambio sigue en una rama y debe satisfacer los contratos y gates.

### 4. El adaptador Tina se generará desde una frontera inspeccionable y medible

Las 188 rutas neutrales seguirán siendo el baseline global. El adaptador Tina declarará cobertura para todas las rutas de Slice B y marcará fuera de alcance las de C/D sin presentarlas como seguras. Una prueba normalizará el schema Tina y lo comparará con el manifest, tipos runtime y fixtures. El round-trip operará sobre copias y verificará valores, discriminantes, orden, listas y ausencia real de opcionales.

La fotografía Stackbit no se elimina: queda como evidencia histórica de la capa reemplazada. Los tests vigentes podrán reorganizarse, pero el gate resultante debe seguir siendo determinista, offline y sin mutar `src/data`.

### 5. Una única plantilla pública y formularios editoriales condicionales

Tina expondrá `Articulo` e `Instruccion` con objetos/templates para sus uniones discriminadas. Los campos técnicos `type`, rutas derivadas y constantes se ocultarán o derivarán. Los campos opcionales usarán controles que permitan ausencia verdadera; no se guardarán strings vacíos, objetos vacíos ni placeholders para simular contenido.

La interfaz usará labels, ayudas y agrupaciones en español, títulos útiles para listas, selectores para estados y relaciones, y validación cercana al campo para slug, alt, fechas, estado, activos y módulos. Podrá incluir una pantalla custom inspirada en el portfolio, limitada a resumen y accesos de Artículos/Instrucciones.

### 6. Defaults seguros y publicación contractual

Todo documento nuevo se crea como `draft`, sin `publishedAt`, revisor clínico ni aprobación inferida. Los estados cerrados serán los admitidos por el runtime. La producción seguirá incluyendo solo `published`; para contenido clínico, los validadores exigirán los metadatos aprobados ya definidos. Paula debe aprobar afirmaciones e imágenes clínicas y Alejandro marca la validación final del OpenSpec.

### 7. Medios Git-backed con límites explícitos

Las imágenes autorizadas se almacenarán en rutas públicas admitidas y se editarán con controles de imagen/alt. Para video y descargas, el primer slice usará referencias de archivo validadas; no se prometerá upload de MP4 hasta probar formato, tamaño y comportamiento real. Tina no almacenará consentimientos, historias clínicas, nombres identificatorios ni otros datos sensibles.

### 8. Migración incremental y retiro diferido de Stackbit

Primero se instalará Tina junto al adaptador anterior, luego se demostrará paridad y se probará el flujo real. Solo después del preview aprobado podrán retirarse dependencias/configuración operativa de Stackbit que no sostengan evidencia o tests. Las specs canónicas cambiarán el proveedor vigente a Tina; el cambio amplio anterior quedará marcado como programa reemplazado y no aplicable en bloque.

## Risks / Trade-offs

- **[El plan gratuito no automatiza PR y merge]** → Tina solo escribe una rama; GitCron/GitHub conserva el flujo de PR, CI y aprobación.
- **[Una configuración errónea podría apuntar Tina a `main`]** → variable explícita, aserción de build/CI y prueba E2E que demuestre la rama destino antes de habilitar editores.
- **[El schema Tina podría serializar JSON de forma distinta]** → comparador estructural y round-trip sobre fixtures mínimos, completos y documentos reales copiados.
- **[Campos opcionales podrían transformarse en vacíos]** → `format/parse` o saneamiento probado y comparación semántica que distinga ausencia de placeholder.
- **[El admin aumenta dependencias y tiempo de build]** → el sitio público no usa Tina en runtime; se mide build y se evita versionar salidas generadas innecesarias.
- **[TinaCloud o GitHub no disponibles]** → se pausa la edición; producción continúa desde los JSON de `main` y se puede editar localmente de forma controlada.
- **[Activos clínicos o secretos expuestos]** → media solo autorizada, alt obligatorio, revisión humana y secretos exclusivos de entorno.
- **[Doble infraestructura durante la migración]** → convivencia breve y documentada; retiro selectivo de Stackbit solo con tests Tina aprobados.

## Migration Plan

1. Registrar versiones, rama, variables requeridas, proyecto Tina y baseline contractual sin incluir secretos.
2. Instalar versiones compatibles y fijadas de Tina; agregar configuración Next.js, `/admin` y build reproducible.
3. Implementar y medir el adaptador Tina de Artículos/Instrucciones contra manifest, runtime y fixtures.
4. Configurar UX editorial, defaults, activos, relaciones y campos opcionales sin modificar contenido aprobado.
5. Probar localmente crear/editar documentos sintéticos y round-trip de copias de documentos reales.
6. Publicar Draft PR, ejecutar CI y verificar que Tina escribe la rama exacta y genera Deploy Preview no indexable.
7. Realizar un piloto supervisado de Artículo e Instrucción; Paula revisa lo clínico y Alejandro la UX/diff/preview.
8. Tras aprobación humana, cerrar y archivar el OpenSpec en la misma rama; merge solo con autorización.

**Rollback:** deshabilitar o retirar `/admin` y la configuración Tina, revertir sus commits y conservar los JSON/loaders públicos. Si un modelo pierde información, se bloquea su escritura y se restaura el documento desde Git. El retiro del adaptador Stackbit no se ejecutará hasta que Tina supere la evidencia equivalente.

## Open Questions

- Confirmar durante implementación el nombre y la rama editorial permanente para uso posterior al OpenSpec; nunca podrá ser `main`.
- Confirmar qué cuenta de Alejandro creará el proyecto TinaCloud de OdontoPau y, antes del piloto, si Paula necesita acceso o solo revisión de preview.
- Verificar con un fixture real si el media manager Git-backed cubre MP4 en los límites aceptables; de no hacerlo, mantener carga externa controlada y referencia validada.
- Decidir después del piloto si la pantalla custom aporta valor suficiente frente al listado estándar; no debe bloquear la paridad ni el flujo seguro.
