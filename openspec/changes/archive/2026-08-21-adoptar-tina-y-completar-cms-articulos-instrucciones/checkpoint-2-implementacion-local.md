## Checkpoint 2: implementación y QA local de Tina

Fecha: 2026-08-12.

### Resultado

El Slice B quedó implementado y verificado localmente para las colecciones
`Articulo` e `Instruccion`. El sitio público continúa leyendo JSON desde
`src/data`; Tina actúa solamente como interfaz de autoría y no participa del
runtime público.

### Infraestructura y seguridad

- Dependencias fijadas: `tinacms@3.11.0` y `@tinacms/cli@2.5.6`.
- `/admin` se genera de forma reproducible con `pnpm run build:cms:local`.
- `tina/__generated__` y `public/admin` son artefactos regenerables ignorados;
  `tina/tina-lock.json` sí se versiona y se valida por CI.
- El modo remoto exige `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN` y una rama
  explícita no productiva. Ocho escenarios automáticos comprueban que `main`,
  `master`, una rama vacía y el fallback remoto inseguro quedan bloqueados.
- El token de build no aparece en el HTML/JavaScript generado. Solo se
  versionan nombres de variables, nunca valores.
- Netlify construye el admin únicamente en Deploy Preview o Branch Deploy.
  Producción conserva por ahora el build público sin Tina hasta que se cree y
  audite una rama editorial permanente. `/admin/*` lleva `X-Robots-Tag:
  noindex, nofollow, noarchive`.

### Paridad y contratos

- Baseline global: 31 modelos neutrales y 188 rutas, sin diferencias contra la
  matriz inventariada.
- Adaptador Tina Slice B: 26/26 modelos y 130/130 rutas cubiertas.
- Contrato Tina vigente: 130/130 rutas clasificadas `safe`.
- Equivalencia histórica Stackbit: 29/29 modelos conservados como evidencia.
- Round-trip en memoria: 36/36 fixtures y 1691 campos preservados.
- Validación negativa: 23/23 casos globales, 20/20 de contratos y ocho casos
  Tina rechazados según el error esperado.
- Auditoría Tina: 13 Artículos y cuatro Instrucciones reales válidos.

### Experiencia editorial verificada

- Panel editorial custom en español con accesos a Artículos e Instrucciones,
  conteos por estado y documentos recientes.
- Formularios nativos de Tina para documentos existentes, con categorías,
  tratamientos, metadata, imágenes y alt, fuentes, descargas y todos los
  módulos discriminados del sitio.
- Alta segura con título inicial, filename sanitizado, `draft` por defecto,
  discriminante e ID derivados, y bloqueo de publicación sin fecha ni revisor
  clínico.
- Campos opcionales pueden omitirse; los validadores no introducen placeholders
  ni reservan contenido inexistente.
- Los MP4 reales referenciados fueron validados por ruta, extensión y firma
  `ftyp`. El media manager no promete upload de MP4 en este slice: se usa una
  referencia pública Git-backed controlada.

### Prueba real de creación, edición y recuperación

`pnpm run test:tina-local-roundtrip` utilizó la API GraphQL local de Tina para:

1. crear un Artículo sintético y una Instrucción sintética bajo carpetas de
   auditoría exactas;
2. leerlos con los loaders públicos y validar el contrato runtime;
3. editar el resumen del Artículo;
4. eliminarlos mediante Tina; y
5. comparar SHA-256 del árbol completo antes y después.

Resultado: ambos documentos fueron creados, validados y eliminados; el Artículo
fue además editado, y `src/data` quedó byte a byte idéntico al estado inicial.

### Gates ejecutados

- `pnpm install --frozen-lockfile`: pasó.
- `pnpm run test:cms-equivalence`: pasó.
- `pnpm run validate:cms-contracts`: pasó.
- `pnpm run validate:tina-branch`: pasó.
- `pnpm run test:tina-adapter`: pasó.
- `pnpm run test:tina-media`: pasó.
- `pnpm run test:tina-editorial-rules`: pasó.
- `pnpm run test:tina-runtime`: pasó.
- `pnpm run validate:tina-content`: pasó.
- `pnpm run validate:tina-lock`: pasó.
- `pnpm run test:tina-local-roundtrip`: pasó.
- `pnpm run build:cms:local`: pasó.
- `pnpm run typecheck`: pasó.
- `pnpm run lint`: pasó.
- `pnpm run build`: pasó; 55 páginas estáticas generadas y tipos válidos.
- `git diff --check`: pasó; solo se informaron conversiones futuras LF/CRLF.
- `pnpm run validate:openspec`: 18 elementos válidos, cero fallos. La descarga
  de telemetría PostHog agotó su timeout de un segundo, sin afectar el resultado
  ni el código de salida.

### Límite del checkpoint

Después de este checkpoint Alejandro incorporó Visual Editing al alcance. Por
eso el gate 5.1 debe repetirse y permanecen pendientes 4.5, 4.6 y 5.3, además
del Draft PR, CI/Deploy Preview, autenticación real, prueba de escritura remota,
auditoría integral del preview y aprobaciones humanas de 5.4, 5.5 y 6.1. No se
realizó commit, push, PR, archive, merge ni deploy.
