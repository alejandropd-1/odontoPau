## 1. Modelo y flujo editorial

- [x] 1.1 Reemplazar `published` por estados editoriales, fechas y revisión clínica en el modelo de instrucciones.
- [x] 1.2 Incorporar validación runtime para documentos, módulos, tratamientos, slugs e imágenes.
- [x] 1.3 Agregar helpers de preview, canonical, sharing y assets alineados con el circuito de artículos.

## 2. Plantilla modular

- [x] 2.1 Implementar módulos tipados de pasos, matriz, aviso y texto sin placeholders.
- [x] 2.2 Renovar el encabezado, breadcrumbs, metadata visible y control general `Compartir` sin CTA redundante de WhatsApp.
- [x] 2.3 Implementar el panel opcional de infografía con visualización y descarga accesible.
- [x] 2.4 Adaptar listado y detalle a mobile, zoom, teclado, contraste AA y movimiento reducido.
- [x] 2.5 Compactar matrices de altura variable con masonry CSS progresivo y fallback compatible sin alterar el orden semantico.

## 3. CMS, SEO e integración

- [x] 3.1 Actualizar modelos Stackbit para estados, revisión, recursos y módulos discriminados.
- [x] 3.2 Incorporar metadata absoluta de preview, `noindex` de borradores y JSON-LD solo para publicaciones.
- [x] 3.3 Verificar que listados, rutas y sitemap de producción incluyan únicamente instrucciones publicadas.

## 4. Contenido inicial

- [x] 4.1 Optimizar y copiar la infografía aprobada de Dieta blanca con nombre semántico y sin metadatos innecesarios.
- [x] 4.2 Migrar Dieta blanca al módulo de matriz respetando literalmente la información aprobada.
- [x] 4.3 Optimizar y copiar la infografía aprobada de Indicaciones post extracción.
- [x] 4.4 Crear Indicaciones post extracción con pasos y criterios de consulta sin agregar afirmaciones clínicas.
- [x] 4.5 Migrar Cuidados para alineadores al nuevo contrato como borrador pendiente de aprobación.

## 5. Trazabilidad editorial

- [x] 5.1 Registrar la aprobación de estructura y contenido de los artículos de prueba 1 y 2.
- [x] 5.2 Registrar que la estructura del artículo de prueba 3 fue aprobada y que su imagen quedó rechazada por no corresponder al traumatismo de la pieza 11.
- [x] 5.3 Documentar el ingreso futuro por WhatsApp y las puertas de aprobación clínica, visual y de publicación.

## 6. Validación y preview

- [x] 6.1 Ejecutar `openspec validate crear-circuito-instrucciones-pacientes --strict`.
- [x] 6.2 Ejecutar `pnpm exec tsc --noEmit` y `pnpm run lint`.
- [x] 6.3 Ejecutar `pnpm run build` para producción y confirmar que los borradores no generan rutas ni sitemap.
- [x] 6.4 Ejecutar un build con `CONTEXT=deploy-preview` y comprobar ambas instrucciones en desktop y mobile.
- [x] 6.5 Obtener aprobación explícita antes de commit, push, merge o publicación en `main`.
