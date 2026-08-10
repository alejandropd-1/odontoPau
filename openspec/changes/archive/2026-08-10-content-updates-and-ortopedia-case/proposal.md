## Why

Actualizar información de profesionales, corregir epígrafes, pulir redacción clínica y sumar un nuevo caso de ortopedia con imágenes específicas, garantizando que el sitio refleje la calidad y detalle de los abordajes clínicos reales del equipo.

## What Changes

- **Página de inicio (Equipo):** Actualización de las matrículas de los 4 profesionales y corrección del rol de Paula Gualtieri ("Especialista en ortodoncia y ortopedia").
- **Servicio Rehabilitación:** Correcciones de texto en subtítulos, título de caso clínico, epígrafes de las fotos y cuerpo del artículo para mayor precisión odontológica ("muñones" en vez de "bases").
- **Servicio Ortodoncia Invisible:** Modificación del texto principal del servicio y del texto de casos clínicos. La instrucción de KeepSmiling incorpora una galería compacta junto al bloque de hábitos, con seis portadas visuales y descarga de dos videos asociados.
- **Servicio Estética Dental:** Nueva imagen Hero (fondo consultorio), reordenamiento de profesionales, correcciones de epígrafes y título de caso ("anterior"), y recorte de foto para ocultar identidad.
- **Servicio Odontología Pediátrica:** Nueva imagen Hero incorporando anteojos a la niña.
- **Servicio Endodoncia:** Actualización del texto sobre tratamiento de conducto mecanizado y eliminación de secciones obsoletas (FAQ y Fuentes).
- **Instrucciones:** Ajuste de textos descriptivos ("procedimientos") y títulos de las guías.
- **Consistencia de títulos:** Las tarjetas de casos clínicos usan el mismo título que el artículo vinculado mediante `articleSlug`.
- **Nuevo caso clínico (Ortopedia):** Integración de caso-01 desde Drive con fotos optimizadas y texto ad-hoc adaptado al tono.

## Capabilities

### New Capabilities
- `content-updates`: Modificaciones estructurales de contenido, correcciones tipográficas, actualizaciones en descripciones de equipo y agregados de casos clínicos (Ortopedia).
- `image-processing`: Recortes (Estética) y generación de imágenes hero adaptadas al contexto médico.

### Modified Capabilities
- `downloadable-resources`: Presentación visual 01–06 y reproducción o descarga directa de los dos videos asociados mediante controles superpuestos en la primera y la última tarjeta de la instrucción KeepSmiling.

## Impact

- **Código:** `AboutUs.tsx`
- **Datos Estáticos:** Archivos JSON en `src/data/tratamientos/` y los catálogos en `src/data/articulos.ts` y `src/data/instrucciones.ts`.
- **Media:** Imágenes nuevas en `public/images/casos/ortopedia/caso-01/`, nuevas imágenes Hero.

## Alcance, Fuera de alcance y Criterios (Reglas)
- **Alcance:** Modificaciones exclusivas a los textos listados e inclusión del caso de ortopedia-01. Generación de dos nuevas imágenes hero y un recorte de rostro en fotos existentes.
- **Fuera de alcance:** Modificación a otros casos o tratamientos no listados. Reestructuración de la base de datos a un CMS dinámico (Supabase migración queda para otro OpenSpec).
- **Riesgos Clínicos:** Asegurar que los términos médicos reemplazados ("muñones", "anterior") se mantengan fieles a lo que revisó el profesional. Validar el caso de ortopedia para que no exponga datos filiatorios sensibles.
- **Criterios de Éxito:** Las vistas reflejan los textos solicitados, la galería KeepSmiling ocupa la columna derecha junto a los hábitos y muestra una secuencia visual 01–06; solo las tarjetas 01 y 06 muestran sobre la imagen un indicador de reproducción y un control de descarga por ícono, sin botones de texto ni acciones en 02–05. Todas las cards de una misma fila conservan igual altura. Los títulos vinculados coinciden y la identidad visual y fotográfica se mantiene coherente.
