## Why

El sitio ya cuenta con una plantilla editorial modular, pero todavía mezcla imágenes mal asociadas, casos clínicos de demostración y datos de profesionales codificados en el componente. Este cambio convierte el material confirmado por Paula en un lote revisable y migra “Implantes Dentales” a “Rehabilitación” sin perder accesos ni coherencia entre tratamientos, artículos, CMS y SEO.

## What Changes

- Corregir el artículo de resina en pieza 11 para que use las imágenes de `estetica_dental/caso-02`, manteniéndolo fuera de producción hasta completar la revisión visual final.
- Crear borradores modulares para el caso de ortodoncia, el caso de odontopediatría y la rehabilitación del sector anterosuperior, usando sólo los textos e imágenes cuya asociación fue confirmada.
- Reemplazar el caso de odontopediatría contaminado con información de implantes por contenido prudente, una sola imagen autorizada y sin etiqueta “Antes/Después”.
- **BREAKING**: cambiar el identificador y la ruta canónica del tratamiento `implantes` a `rehabilitacion`, conservando redirecciones permanentes desde las URLs anteriores.
- Retirar de la página migrada los casos, porcentajes, duraciones, testimonios y promesas de resultado que no cuentan con respaldo confirmado.
- Convertir el badge del hero de tratamientos en un módulo guiado por JSON que admita uno o más profesionales con retrato, nombre y rol; usar los retratos reales de Paula, Roberto, Pablo y María Emilia según las asociaciones confirmadas.
- Actualizar CMS, metadatos, sitemap, enlaces internos y páginas de archivo para el nuevo identificador de Rehabilitación.
- Incorporar un segundo lote de revisión con un caso de Odontopediatría de tres imágenes anonimizadas, un caso de Ortodoncia Invisible de una imagen y un caso de Estética Dental de tres imágenes sin secuencia temporal confirmada.
- Reemplazar el hero genérico de Ortopedia por un collage editorial construido únicamente con fotografías de aparatología de la carpeta confirmada, excluyendo capturas y productos ajenos al servicio.

### Fuera de alcance

- Publicar directamente los nuevos borradores en producción o omitir los controles editoriales existentes.
- Crear artículos para `estetica_dental/caso-03` o `Rehabilitacion/caso-01` y `caso-03` sin contexto clínico adicional de Paula.
- Inferir el diagnóstico, la técnica o la secuencia clínica de los casos 02/04 del segundo lote a partir de las imágenes.
- Inferir diagnósticos, materiales, resultados, especialidades o secuencias temporales sólo a partir de fotografías.
- Hacer commit, push, merge o desplegar la rama `main` en este cambio.

### Riesgos clínicos

- Una asociación incorrecta entre texto e imagen puede presentar un tratamiento distinto del realizado.
- Las fotografías de pacientes pueden exponer identidad si se publica una variante no autorizada.
- El contenido heredado contiene promesas, porcentajes y casos ficticios que no deben sobrevivir como evidencia clínica.
- “Ortodoncia Invisible” es el nombre del servicio, pero el caso aportado no debe describirse como invisible ni convencional sin confirmación específica.

### Criterio de éxito

- Cada artículo nuevo se renderiza en preview con su densidad real de contenido, sin módulos vacíos ni afirmaciones inventadas.
- El caso de pieza 11 usa exclusivamente las imágenes de `caso-02` y el caso pediátrico usa la variante anonimizada autorizada.
- `/tratamientos/rehabilitacion` es la URL canónica y las rutas antiguas de implantes redirigen sin generar duplicados en sitemap o CMS.
- Cada tratamiento muestra únicamente profesionales declarados en sus datos; cuando no existe una asociación confirmada no se presenta una especialidad inventada.
- Los tres casos del segundo lote aparecen sólo en preview, sin etiquetas temporales no confirmadas, y Ortopedia muestra un hero compuesto exclusivamente por aparatología pertinente.
- TypeScript, lint, build de producción, build de preview y verificación visual responsive finalizan sin errores funcionales.

## Capabilities

### New Capabilities

- `lote-clinico-confirmado`: preparación y validación del lote de artículos y casos que ya cuentan con texto, asociación de imágenes y autorización suficiente para revisión.
- `rehabilitacion-canonica`: migración del tratamiento Implantes Dentales a Rehabilitación, incluyendo rutas, redirecciones, enlaces, CMS y SEO.
- `profesionales-por-tratamiento`: modelo y presentación accesible de uno o más profesionales confirmados en el hero de cada tratamiento.

### Modified Capabilities

Ninguna; todavía no existen especificaciones base publicadas en `openspec/specs`.

## Impact

- Datos: `src/data/tratamientos`, `src/data/articulos` y sus validadores TypeScript.
- Interfaz: hero y casos de tratamientos, detalle de artículos y estilos SASS asociados.
- Activos: imágenes optimizadas de profesionales y casos dentro de `public/images`.
- Rutas: páginas dinámicas de tratamientos, casos, archivos de artículos, sitemap y redirecciones de Next.js/Netlify.
- CMS: modelos de Stackbit/Netlify Create para profesionales y tratamiento Rehabilitación.
- Operación: la producción seguirá dependiendo de una integración posterior a `main`; este cambio no la realiza.
