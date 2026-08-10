## Context

El sitio ya carga instrucciones JSON recursivamente, genera `/instrucciones/[category]/[slug]`, las expone en Stackbit y usa el control compartido `ShareArticleMenu`. El modelo actual depende de `published: boolean`, solo admite tarjetas numeradas uniformes, no valida los documentos en runtime y usa la imagen del tratamiento como recurso principal aunque exista una infografía específica.

Las nuevas piezas provistas por Paula muestran dos necesidades distintas: `Dieta blanca` organiza información por categorías y estados (`Sí`, `Precaución`, `No`), mientras `Indicaciones post extracción` presenta una secuencia de pasos con tiempos y criterios de consulta. Ambas deben conservar una representación textual accesible y una infografía complementaria para compartir o descargar.

## Goals / Non-Goals

**Goals:**

- Resolver instrucciones breves o extensas con una única plantilla modular y una identidad estable.
- Reutilizar el flujo editorial de artículos para que solo `published` llegue a producción y el resto sea revisable en Deploy Preview con `noindex`.
- Validar estructura, rutas, tratamientos, imágenes y estados al construir el sitio.
- Mantener el control general `Compartir` como única acción de distribución debajo del título.
- Dar a cada infografía un equivalente HTML semántico y legible en móvil, zoom y lectores de pantalla.
- Mostrar fechas de revisión y autoridad clínica sin guardar información sensible.

**Non-Goals:**

- Automatizar envíos de WhatsApp, sustituir la consulta profesional o inferir indicaciones clínicas.
- Crear una plantilla independiente por tratamiento o pedir al editor que elija una densidad.
- Introducir Markdown, una base de datos, otro CMS o una biblioteca de validación nueva.
- Modificar el contenido clínico aprobado para mejorar SEO o estilo sin una nueva revisión.

## Decisions

### Estado editorial alineado con artículos

`Instruccion` usará `status: draft | clinical_review | technical_review | approved | published`, `updatedAt`, `clinicalReviewer` y `publishedAt` opcional. Desarrollo, branch deploy y Deploy Preview generarán rutas para todos los estados; producción generará solo `published`. Los borradores tendrán `robots: noindex, nofollow` y no entrarán al sitemap.

Alternativa descartada: conservar `published: boolean`. No permite saber por qué una instrucción todavía no puede publicarse ni distingue aprobación clínica de revisión técnica.

### Unión discriminada de módulos

El contenido usará bloques tipados:

- `steps`: lista ordenada de indicaciones, con título e introducción opcionales.
- `matrix`: grupos temáticos con listas `Sí`, `Precaución` y `No`; cada estado ausente no se renderiza.
- `notice`: aviso general, recordatorio o criterio de consulta con tono semántico.
- `text`: párrafos breves cuando no se necesita una estructura especial.

Todos los módulos son opcionales individualmente, pero cada documento necesita al menos uno. La densidad surge de los datos presentes y no de un selector de plantilla.

Alternativa descartada: seguir modelando todo como `sections[].items`. Obliga a representar matrices como listas ambiguas y no permite dar a los criterios de consulta una semántica diferenciada.

### Infografía complementaria, no hero fotográfico

Un campo opcional `resourceImage` tendrá `src`, `alt`, dimensiones, rótulo y texto de enlace. Si existe, se muestra en un panel de recurso con vista completa y descarga; el contenido clínico permanece en HTML. Las tarjetas del índice podrán usar una miniatura derivada de este recurso con `object-fit: contain`, sin exigir una foto del tratamiento.

Alternativa descartada: presentar la infografía como única fuente. El texto pequeño de una pieza 10x15 no es una alternativa accesible y reduce la indexabilidad y la facilidad de actualización.

### Matrices compactas de altura variable

Las matrices con grupos de distinta longitud usaran una composicion masonry progresiva a partir de tablet: CSS Columns sera el fallback estable y el modo nativo de CSS Grid Level 3 se activara solo mediante `@supports` cuando este disponible. En mobile se conservara una unica columna. Cada grupo evitara cortes internos y mantendra el orden del documento como fuente semantica, sin calcular alturas ni reordenar contenido con JavaScript.

Alternativa descartada: una grilla de filas uniformes. Iguala la altura de tarjetas vecinas y produce grandes espacios vacios cuando las categorias tienen cantidades de recomendaciones diferentes.

### Sharing genérico sin duplicación

Se conserva `ShareArticleMenu` debajo del título y se le entrega la URL real del deploy cuando se revisa un borrador. No se agrega un botón exclusivo para WhatsApp. El recurso descargable es una acción documental diferente y solo aparece si existe una infografía.

### Metadata y datos estructurados

Cada detalle tendrá canonical de producción, Open Graph con URL absoluta del deploy en preview, `MedicalWebPage` JSON-LD únicamente al estar publicado y breadcrumbs visibles. La imagen social podrá ser independiente de la infografía vertical para evitar previews recortados; si no existe, se usará un recurso institucional seguro.

### Migración gradual y compatibilidad editorial

Las instrucciones existentes se migrarán al nuevo contrato sin cambiar silenciosamente sus afirmaciones. `Dieta blanca` se reemplazará por el contenido de la pieza aprobada y `Post extracción` se incorporará como segundo ejemplo. `Cuidados para alineadores` permanecerá como borrador hasta recibir aprobación clínica explícita.

### CMS Git-based como entrada operativa

Stackbit expondrá estados, revisión, módulos discriminados e imágenes. El circuito preferido seguirá siendo: texto e imagen recibidos por WhatsApp, estructuración en branch, Deploy Preview, aprobación clínica y visual, merge autorizado a `main` y despliegue de Netlify.

## Risks / Trade-offs

- [Un tiempo o recomendación se interpreta como universal] → Mostrar un aviso de prevalencia de las indicaciones personalizadas y exigir revisión clínica antes de `published`.
- [Un editor marca como publicado un documento incompleto] → Validar `publishedAt`, `clinicalReviewer`, módulos e imágenes durante el build.
- [El color es el único indicador de Sí/Precaución/No] → Mantener títulos e iconos/textos visibles además del color y verificar contraste AA.
- [La infografía vertical se vuelve ilegible en móvil] → Ofrecer vista ampliable/descarga y repetir toda la información esencial en HTML.
- [La imagen social vertical se recorta en WhatsApp] → Separar `socialImage` de `resourceImage`; usar fallback institucional hasta contar con una pieza horizontal.
- [Una instrucción aprobada queda desactualizada] → Mostrar `updatedAt` y `clinicalReviewer`, y revisar nuevamente al modificar contenido clínico.
- [La migración retira accidentalmente una URL] → Conservar categorías y slugs actuales; cambiar solo el contrato interno y filtrar por estado.

## Migration Plan

1. Incorporar tipos, validación, estados y helpers de rutas/URLs conservando slugs actuales.
2. Actualizar el CMS y el renderizador modular con estilos responsive y accesibles.
3. Optimizar y copiar las dos infografías provistas bajo rutas semánticas.
4. Migrar `Dieta blanca` y crear `Indicaciones post extracción` con estado de revisión hasta completar el checkpoint.
5. Pasar `Cuidados para alineadores` a borrador sin alterar su texto, pendiente de aprobación.
6. Validar OpenSpec, TypeScript, lint, build normal y build de Deploy Preview.
7. Tras la aprobación explícita, publicar mediante la rama y el flujo Netlify habitual.

Rollback: revertir el estado a `draft` para retirar una instrucción de producción y redesplegar. Si la plantilla falla, se pueden retirar temporalmente los enlaces conservando los JSON y las imágenes versionadas.

## Open Questions

- Paula deberá confirmar si las infografías actuales se consideran piezas finales o si luego se generarán versiones horizontales específicas para Open Graph.
- La publicación en producción y cualquier ajuste clínico posterior siguen pendientes de autorización explícita; esta implementación solo prepara el preview.
