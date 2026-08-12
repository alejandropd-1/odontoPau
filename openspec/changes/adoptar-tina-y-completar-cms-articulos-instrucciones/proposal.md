## Why

La base contractual neutral ya permite cambiar de proveedor sin alterar el contenido público, pero el programa CMS vigente todavía prescribe Stackbit/Netlify Visual Editor y no ofrece una experiencia suficientemente directa para editores no técnicos. Se adopta TinaCMS ahora, antes de habilitar escrituras reales, para conservar JSON + Git como fuente de verdad y entregar primero un circuito útil y seguro para Artículos e Instrucciones.

## What Changes

- **BREAKING (herramienta editorial, no sitio público):** TinaCMS pasa a ser el adaptador y la interfaz de autoría vigentes; Stackbit/Netlify Visual Editor deja de ser el destino de los nuevos slices y queda únicamente como evidencia histórica de la línea base.
- Incorporar TinaCMS a Next.js con `/admin`, colecciones JSON para `Articulo` e `Instruccion`, objetos anidados, módulos discriminados, activos y ayudas editoriales en español.
- Reutilizar el manifest neutral, el baseline de 188 rutas y los comparadores existentes para demostrar paridad y round-trip propios del adaptador Tina antes de habilitar escritura.
- Mantener `src/data` y Git como fuente canónica, los loaders/renderizadores públicos actuales y Netlify como hosting, Deploy Preview y publicación desde `main`.
- Separar responsabilidades: Tina edita una rama controlada; GitCron/GitHub gestiona Draft PR, CI, revisión, merge y trazabilidad. El cambio no dependerá del Editorial Workflow pago de Tina.
- Crear documentos nuevos con estado seguro `draft`; impedir que `draft` o `technical_review` entren en producción o indexación.
- Diseñar una experiencia custom para personas no técnicas: nombres claros, campos técnicos ocultos o derivados, agrupaciones, validaciones cercanas al campo y omisión total de bloques opcionales vacíos.
- Reconciliar el roadmap y declarar que las decisiones de proveedor de `hacer-sitio-autoadministrable-desde-cms` quedan reemplazadas por esta adopción incremental de Tina; el programa amplio no se aplicará como un bloque de 96 tareas.
- Probar creación, edición, ampliación, activos y recuperación de Artículos e Instrucciones en una rama y Deploy Preview, con aprobación clínica de Paula cuando corresponda y validación final manual de Alejandro.

### Alcance

- Infraestructura común mínima de TinaCMS, autenticación/proyecto y variables de entorno sin secretos versionados.
- Artículos e Instrucciones, incluidos sus módulos anidados, imágenes, descargas y referencias de video.
- Contratos, paridad, round-trip, CI, preview, documentación operativa y piloto supervisado del slice.

### Fuera de alcance

- Tratamientos, profesionales, casos clínicos, portada y contenido institucional; tendrán slices posteriores.
- Redes sociales, dashboard Supabase, automatización local y publicación autónoma sin revisión.
- Page builder libre, modificación visual del sitio o migración del contenido canónico a una base propietaria.
- Editorial Workflow pago de Tina, alta definitiva de clientes externos o autoservicio multi-sitio.

### Riesgos clínicos y criterio de éxito

- Ningún contenido clínico ni imagen de paciente se publica sin consentimiento verificable y aprobación de Paula; el repositorio y Tina no almacenan historias clínicas ni comprobantes privados.
- El cambio será exitoso cuando Tina conserve sin pérdida todos los campos del slice, un editor pueda crear y ampliar documentos sin tocar código, los estados no publicables sigan excluidos, el diff sea revisable en un Draft PR y el sitio público mantenga URLs, SEO, responsive y contenido aprobados.

## Capabilities

### New Capabilities

- `autoria-tina-cms`: Configuración, experiencia editorial, ramas, autenticación, activos y límites operativos de TinaCMS como interfaz de autoría Git-backed.

### Modified Capabilities

- `paridad-contratos-cms`: Tina se agrega como adaptador medido para el slice B y debe probar equivalencia contra el contrato neutral sin borrar la evidencia histórica de Stackbit.
- `articulos-odontologia`: La creación y edición completa de artículos pasa de Netlify Visual Editor a TinaCMS, manteniendo una única plantilla condicional.
- `instrucciones-pacientes`: La creación y edición de instrucciones, recursos, imágenes y videos pasa de Stackbit/Netlify Visual Editor a TinaCMS.
- `flujo-editorial-clinico`: La escritura editorial se realiza en una rama controlada por Tina y conserva aprobación clínica, revisión humana y estados seguros antes de producción.
- `gates-ci-y-publicacion`: El Git CMS debe alimentar Draft PR, CI y Deploy Preview sin escribir ni publicar directamente sobre `main`.

## Impact

- Dependencias y configuración: `package.json`, lockfile, `tina/config.ts`, artefactos generados de Tina, scripts y variables documentadas para TinaCloud/Netlify.
- Contratos y pruebas: `src/cms`, manifest neutral, adaptador Tina, fixtures, round-trip y workflow de calidad.
- Contenido: `src/data/articulos/**` y `src/data/instrucciones/**` continúan como JSON canónico; solo se usarán copias/fixtures hasta la prueba editorial autorizada.
- Interfaz: nueva ruta administrativa protegida y panel editorial custom; las rutas públicas y su diseño no cambian por adoptar el CMS.
- Operación: TinaCloud administra acceso al proyecto; GitCron/GitHub conserva PR, aprobaciones y merge; Netlify conserva preview y producción.
- Planificación: `openspec/ROADMAP-EJECUCION.md` se actualiza para cerrar la base contractual y priorizar este slice Tina.
