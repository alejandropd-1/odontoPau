# Paula Gualtieri Odontología

Sitio institucional y circuito editorial para tratamientos, casos clínicos, artículos e instrucciones para pacientes.

El proyecto usa una arquitectura de contenido basada en JSON y Git. Los contenidos clínicos se preparan como borradores, se revisan en un deploy draft de Netlify y sólo pasan a producción después de una aprobación clínica, visual y técnica explícita.

> Estado al 5 de agosto de 2026: el lote editorial se encuentra en revisión mediante un draft de Netlify. No está integrado en `main` ni publicado en producción.

## Documentación para continuar el trabajo

- [Handoff editorial y operativo](docs/HANDOFF-EDITORIAL-2026-08-05.md): estado exacto, cambios realizados, validaciones, despliegue en Netlify y punto de reanudación para otra IA.
- [Changelog](CHANGELOG.md): historial funcional y editorial.
- [OpenSpec del lote clínico](openspec/changes/integrar-lote-clinico-y-rehabilitacion/): alcance, decisiones, especificaciones y gates pendientes.
- [OpenSpec del runner con LM Studio Link](openspec/changes/preparar-runner-editorial-lm-studio-link/): investigación futura; todavía no implementada.
- [Contexto de producto y tono](.agents/product-marketing.md): público, posicionamiento, voz y límites de redacción.

## Stack real

- Next.js 15 con App Router.
- React 19 y TypeScript.
- SASS/SCSS modular, tokens propios y clases BEM.
- Motion para transiciones y microinteracciones.
- Lucide React para iconografía.
- JSON dentro de `src/data/` como fuente de contenido.
- Stackbit / Netlify Create como CMS visual conectado a Git.
- Netlify para deploys de preview y producción.
- OpenSpec para registrar decisiones, alcance, tareas y gates.

No se usa Astro, Markdown como fuente pública, Tailwind ni un CMS con base de datos.

## Estructura relevante

```text
odontoPau/
├── docs/
│   └── HANDOFF-EDITORIAL-2026-08-05.md
├── openspec/changes/
│   ├── crear-circuito-editorial-articulos-redes/
│   ├── crear-circuito-instrucciones-pacientes/
│   ├── integrar-lote-clinico-y-rehabilitacion/
│   └── preparar-runner-editorial-lm-studio-link/
├── public/images/
│   ├── articulos/<slug>/
│   ├── instrucciones/<slug>/
│   └── profesionales/
├── src/app/
│   ├── articulos/
│   ├── instrucciones/
│   └── tratamientos/
├── src/components/
│   ├── ArticleArchive.tsx
│   ├── ArticleContent.tsx
│   ├── ArticlePagination.tsx
│   ├── InstructionContent.tsx
│   └── TreatmentDetailContent.tsx
├── src/data/
│   ├── articulos/<categoria>/<slug>.json
│   ├── instrucciones/<categoria>/<slug>.json
│   └── tratamientos/<categoria>/<slug>.json
├── src/styles/
├── stackbit.config.ts
└── netlify.toml
```

## Modelo editorial

### Artículos

Los artículos viven en `src/data/articulos/<categoria>/<slug>.json`. El cargador recursivo y sus validaciones están en `src/data/articulos.ts`.

Estados permitidos:

1. `draft`: preparación interna; no aparece en el archivo de preview.
2. `clinical_review`: pendiente de revisión clínica.
3. `technical_review`: listo para revisar estructura, imágenes y responsive en preview.
4. `approved`: aprobado, pero todavía no publicado.
5. `published`: visible en producción; requiere `publishedAt`.

En producción sólo se generan rutas, listados, relaciones y sitemap para artículos `published`. En desarrollo, branch deploy o deploy preview también se exponen los contenidos de revisión, siempre como no indexables.

La plantilla es única y modular. Cada JSON completa solamente los bloques respaldados por la información disponible: resumen, texto, lista, comparación, estadísticas verificadas, galería, FAQ, cita o CTA. No se crean plantillas separadas para artículos cortos y largos.

El archivo general usa nueve artículos por página y también ofrece archivos filtrados por tratamiento:

- `/articulos`
- `/articulos/pagina/<n>`
- `/articulos/tratamiento/<serviceId>`
- `/articulos/tratamiento/<serviceId>/pagina/<n>`

### Tratamientos y casos

Los tratamientos viven en `src/data/tratamientos/<categoria>/<slug>.json` y se cargan desde `src/data/tratamientos.ts`.

Cada tratamiento puede declarar:

- `id`, categoría, orden, título, descripción, icono y `heroImage`;
- una lista opcional `professionals` con nombre, rol, retrato y texto alternativo;
- características informativas verificadas;
- casos clínicos, que pueden enlazar a un artículo mediante `articleSlug`.

La portada de cada tarjeta en `/tratamientos` reutiliza el mismo `heroImage` del servicio. No debe mantenerse un segundo mapa de imágenes.

El servicio antes llamado Implantes Dentales ahora es canónicamente `rehabilitacion`. Las rutas anteriores bajo `/tratamientos/implantes` se conservan sólo como redirecciones permanentes.

### Instrucciones para pacientes

Las instrucciones viven en `src/data/instrucciones/<categoria>/<slug>.json`. Admiten contenido estructurado, recursos descargables, imagen para compartir y relación opcional con un tratamiento.

Rutas principales:

- `/instrucciones`
- `/instrucciones/<categoria>/<slug>`

El mismo circuito de estados y aprobación evita que una indicación en revisión aparezca en producción.

## Reglas clínicas, de privacidad y redacción

- No inferir diagnósticos, materiales, técnicas, tiempos, resultados ni secuencias a partir de una fotografía.
- No usar porcentajes, promesas de éxito, ausencia de dolor o resultados universales sin respaldo verificable.
- No publicar imágenes clínicas sin asociación de carpeta confirmada, consentimiento y revisión visual.
- En imágenes de menores, usar únicamente la variante anonimizada autorizada.
- Las etiquetas `Antes`, `Después` o equivalentes son opcionales y sólo se agregan cuando la secuencia fue confirmada.
- Una imagen aislada no recibe una etiqueta temporal por defecto.
- La copia pública usa la voz institucional `Equipo clínico`; no muestra “Paula dijo”, “según Paula” ni referencias al proceso interno de preparación.
- El tono debe ser claro, cálido y cercano. No describir mecánicamente que “se aportó una imagen” ni rellenar el artículo cuando falta información.
- Los textos alternativos describen lo necesario para comprender la imagen sin identificar pacientes ni inferir datos clínicos.

## Rutina para incorporar un artículo

1. Relevar los archivos recibidos sin modificar el repositorio.
2. Confirmar servicio, caso, orden de imágenes, autorización, texto clínico y si existe una secuencia temporal.
3. Abrir o actualizar un cambio de OpenSpec.
4. Normalizar nombres y optimizar imágenes en `public/images/articulos/<slug>/`.
5. Crear el JSON en `src/data/articulos/<categoria>/<slug>.json` con estado de revisión.
6. Completar sólo los módulos respaldados por la información recibida.
7. Vincular el caso desde el tratamiento mediante `articleSlug` cuando corresponda.
8. Ejecutar validaciones técnicas y visuales.
9. Crear un draft de Netlify y compartir sus enlaces con Paula y Alejandro.
10. Registrar las aprobaciones. Recién después se cambia el estado a `published`, se agrega `publishedAt` y se inicia un release autorizado.

El artículo aprobado funciona como contenido madre. Las piezas para redes sociales se derivan después y no reemplazan la revisión del artículo.

## Desarrollo local

Requisitos: Node.js 22 y pnpm 11.

```powershell
pnpm install
pnpm run dev
```

El servidor local queda disponible normalmente en `http://localhost:3000`.

### Build de producción

El build normal debe excluir borradores y contenidos en revisión:

```powershell
pnpm run build
```

### Build editorial de preview

```powershell
$env:CONTEXT='deploy-preview'
$env:NETLIFY_PREVIEW_SERVER='true'
pnpm run build
```

## Validación obligatoria

```powershell
openspec validate --all --strict
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

Para cambios editoriales también se repite el build con contexto de preview y una revisión real en navegador:

- desktop y 375/390 px;
- navegación por teclado y foco visible;
- textos alternativos;
- contraste y `prefers-reduced-motion`;
- consola sin errores ni advertencias;
- ausencia de scroll horizontal;
- metadata, OpenGraph, sitemap y redirecciones;
- confirmación de que producción no expone borradores.

## Drafts de Netlify

El sitio enlazado es `paulagualtieri`, con site ID `b2b9d5a8-e87f-4b22-8452-53e726025db8`. La carpeta `.netlify/` es local y está ignorada por Git.

Un draft manual se crea con `netlify deploy` sin `--prod`. En este equipo el build desde Windows puede fallar por enlaces simbólicos de Next.js; el procedimiento probado usa una copia temporal dentro de WSL. Los comandos exactos, el diagnóstico y el acceso al panel están documentados en el [handoff](docs/HANDOFF-EDITORIAL-2026-08-05.md).

Nunca usar `--prod`, `Publish deploy`, push a `main` ni merge como parte de la preparación editorial. El deploy de producción toma la rama `main` y requiere autorización explícita.

## Stackbit / Netlify Create

Los modelos se definen en `stackbit.config.ts`. Al modificar componentes o datos:

- preservar `data-sb-object-id` y `data-sb-field-path`;
- mantener la estructura JSON esperada por los modelos;
- conservar los datos de profesionales editables, sin condicionales hardcodeados por tratamiento;
- no importar cargadores de filesystem desde componentes cliente: resolver los datos en servidor y pasarlos por props.

## Convenciones visuales

- SASS es la única fuente de estilos.
- Usar BEM y los archivos de `src/styles/components/` o `src/styles/pages/`.
- Consumir tokens mediante `clr()`, `size()`, `fs()`, `ff()`, `radius()`, `shadow()`, `transition()` y `container()`.
- Usar `@include mq(...)` para responsive.
- No agregar Tailwind ni valores aislados si existe un token equivalente.
- Respetar movimiento reducido y foco visible.

## Reglas para agentes de IA

1. Leer este README, el handoff, `.agents/product-marketing.md` y el OpenSpec activo antes de editar.
2. Ejecutar `git status --short` y no limpiar ni sobrescribir un working tree sucio.
3. No copiar directamente salidas de otro generador: convertirlas al modelo Next.js/JSON real.
4. No inventar información clínica ni completar módulos para ocupar espacio.
5. Mantener contenidos nuevos fuera de producción hasta completar los gates humanos.
6. No hacer commit, push, merge, deploy de producción ni cambiar `main` sin autorización explícita.
7. Excluir de cualquier staging accidental `.playwright-cli/`, `output/`, `.codegraph/`, `.netlify/`, `.next/` y otros artefactos locales.
8. Si se trabaja con LM Studio Link, tratar el OpenSpec correspondiente como investigación pendiente: no existe todavía un runner habilitado.
