## Why

La sección `/instrucciones` ya permite publicar fichas desde JSON y editarlas con el CMS, pero su contrato actual no distingue borradores clínicos de contenido aprobado ni resuelve con claridad protocolos ordenados, matrices de recomendaciones y recursos descargables. Este cambio convierte esa base en un circuito seguro y repetible para que Paula comparta indicaciones revisadas con pacientes sin depender de una imagen ilegible o de una publicación manual improvisada.

## What Changes

- Definir una única plantilla modular para instrucciones, capaz de mostrar solamente los bloques completados sin huecos ni variantes visuales manuales.
- Incorporar estados editoriales, revisión clínica, fecha de actualización y vista previa no indexada antes de publicar.
- Admitir dos composiciones iniciales: pasos ordenados y matrices con estados `Sí`, `Precaución` y `No`.
- Presentar alertas o criterios de consulta con jerarquía semántica y visual, sin inventar recomendaciones clínicas.
- Mantener el botón general `Compartir` existente debajo del título; no agregar un CTA exclusivo para WhatsApp.
- Permitir una infografía opcional como recurso para visualizar o descargar, conservando todo su contenido esencial también como HTML accesible.
- Integrar metadata, imagen social, sitemap, enlaces relacionados y CMS con el flujo Git/Netlify existente.
- Crear como casos iniciales `Dieta blanca` e `Indicaciones post extracción`, usando exclusivamente el contenido aprobado por Paula.

### Alcance

- Modelo de datos tipado, loader validado, renderizador modular, estados editoriales y modelos Stackbit.
- Listado y detalle responsive con accesibilidad WCAG 2.2 AA, SEO básico y sharing genérico.
- Dos instrucciones de referencia y sus infografías optimizadas.
- Checklist clínico, editorial, técnico y visual para futuras instrucciones recibidas por WhatsApp.

### Fuera de alcance

- Diagnosticar, indicar medicamentos o modificar tiempos y recomendaciones sin aprobación de Paula.
- Reemplazar las instrucciones personalizadas entregadas durante una consulta.
- Guardar historias clínicas, nombres de pacientes o documentos de consentimiento en el repositorio.
- Publicar automáticamente en `main`, enviar mensajes o crear un botón redundante exclusivo para WhatsApp.

## Capabilities

### New Capabilities

- `instrucciones-pacientes`: Modelo editorial, estados, módulos, rutas, accesibilidad, SEO, recursos compartibles y edición CMS de instrucciones clínicas revisadas.

### Modified Capabilities

No hay especificaciones vigentes que deban modificarse; la sección existente se formaliza como una capacidad nueva de OpenSpec.

## Impact

- Código: `src/data/instrucciones.ts`, `src/app/instrucciones`, componentes relacionados, estilos, sitemap y metadata.
- Contenido: JSON de instrucciones e imágenes bajo `public/images/instrucciones`, con una única fuente textual accesible y un recurso gráfico opcional.
- CMS: evolución de `Instruccion` y sus submodelos en `stackbit.config.ts` sin reemplazar Netlify Visual Editor.
- Operación: Paula confirma cada indicación y recurso; Codex estructura el contenido y prepara el preview; el responsable del sitio autoriza la publicación.
- Riesgos clínicos: indicaciones desactualizadas, tiempos no confirmados, omisión de criterios de consulta y contradicción con instrucciones personalizadas. Se mitigan con estado no publicado por defecto, revisión clínica explícita, fecha de actualización y aviso de prevalencia de la indicación profesional.
- Riesgos técnicos: una infografía como única fuente sería ilegible para lectores de pantalla, buscadores o pantallas pequeñas. Se mitiga duplicando su información esencial como HTML semántico y usando la imagen solo como recurso complementario.
- Criterio de éxito: ambas instrucciones de referencia se pueden revisar en preview, leer y operar desde teclado/móvil, compartir mediante el control general, descargar cuando exista un recurso y permanecer fuera de sitemap/indexación hasta estar publicadas.
