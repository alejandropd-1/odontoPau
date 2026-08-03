## 1. Definiciones editoriales y piloto

- [x] 1.1 Confirmar canales prioritarios, frecuencia inicial, responsable de aprobacion final y criterio de conversion
- [x] 1.2 Elegir con Paula un caso piloto con datos clinicos completos, imagenes correctamente asociadas y autorizacion de uso confirmada
- [x] 1.3 Crear la plantilla de ingreso de tema/caso, datos clinicos, inventario de imagenes, objetivo, CTA y estado de aprobacion
- [x] 1.4 Crear checklist de revision clinica, privacidad, claims, accesibilidad, SEO, preview y publicacion
- [x] 1.5 Revisar los seis borradores de AutoClaw y clasificarlos como reutilizable, requiere correccion o descartado sin publicarlos

## 2. Infraestructura de articulos

- [x] 2.1 Definir interfaces y loader recursivo para `src/data/articulos` con validacion de estados, slugs y `serviceIds`
- [x] 2.2 Crear `/articulos` con tarjetas de articulos publicados, metadata y estados vacios
- [x] 2.3 Crear `/articulos/[slug]` con parametros estaticos, 404, metadata completa y datos estructurados
- [x] 2.4 Implementar bloques de contenido tipados, imagenes, antes/despues, tablas, FAQ, citas, CTA y compartir
- [x] 2.5 Implementar estilos BEM con SASS, tokens y breakpoints existentes
- [x] 2.6 Integrar articulos publicados en sitemap, navegacion y enlaces internos desde/hacia tratamientos
- [x] 2.7 Agregar modelos Stackbit alineados con TypeScript y anotaciones de edicion visual
- [x] 2.8 Ocultar temporalmente la seccion de testimonios y su enlace mediante una opcion reversible, conservando la implementacion existente
- [x] 2.9 Implementar cuerpo editorial continuo y maquetacion adaptable para articulos con una, dos o tres imagenes
- [x] 2.10 Alinear breadcrumb, titulo, animaciones, galeria principal y contenedores con la plantilla visual existente de casos clinicos
- [x] 2.11 Integrar temas, fuentes consultadas y tratamientos relacionados en un cierre editorial compacto y responsive

## 3. Contenido piloto e imagenes

- [x] 3.1 Preparar las imagenes aprobadas del piloto: asociacion, limpieza de metadatos, nombres, dimensiones y textos alternativos
- [x] 3.2 Adaptar el articulo piloto a la nueva estructura con estado `draft` y sin afirmaciones no confirmadas
- [ ] 3.3 Entregar el borrador a Paula y registrar correcciones de diagnostico, tecnica, tiempos, resultados, cifras y testimonio
- [ ] 3.4 Aplicar la revision clinica y mover el piloto a `technical_review` sin publicarlo

## 4. Paquete social recurrente

- [x] 4.1 Definir estructura versionada para derivados sociales fuera del build publico
- [x] 4.2 Generar desde el piloto el formato compatible con los assets disponibles: post simple, carrusel, Stories y/o Reel
- [x] 4.3 Adaptar copy, hook, CTA, hashtags y enlace medible a cada canal prioritario
- [ ] 4.4 Obtener aprobacion de Paula sobre texto e imagenes de cada derivado antes de considerarlo programable

## 5. Validacion y preview

- [x] 5.1 Validar JSON, slugs, relaciones, archivos de imagen, metadata, sitemap y enlaces internos
- [x] 5.2 Ejecutar `pnpm exec tsc --noEmit`
- [x] 5.3 Ejecutar `pnpm run lint`
- [x] 5.4 Ejecutar `pnpm run build`
- [x] 5.5 Verificar listado y detalle en desktop y mobile, incluyendo imagenes, tablas, antes/despues, 404 y accesibilidad basica
- [x] 5.6 Verificar preview OpenGraph/Twitter y que ningun articulo no publicado sea accesible en produccion ni indexable en preview
- [x] 5.7 Verificar que la imagen OpenGraph del borrador sea absoluta y descargable desde el dominio del Deploy Preview
- [ ] 5.8 Presentar preview al responsable del sitio y esperar aprobacion explicita antes de publicar o desplegar

## 6. Publicacion controlada

- [ ] 6.1 Cambiar el piloto a `published` solo despues de las aprobaciones clinica, editorial, tecnica y visual
- [ ] 6.2 Mezclar a `main` mediante el flujo Git/Netlify autorizado y verificar la URL, sitemap, tratamiento relacionado y CTA en produccion
- [ ] 6.3 Entregar el paquete social final con enlaces medibles y calendario acordado sin publicar en cuentas externas sin autorizacion
- [ ] 6.4 Documentar fecha, version, aprobaciones no sensibles y cualquier desviacion en OpenSpec y Git

## 7. Mantenimiento continuo

- [x] 7.1 Establecer una revision mensual de enlaces, contenido desactualizado, imagenes, formularios/WhatsApp y estado del deploy
- [x] 7.2 Registrar metricas disponibles por articulo y pieza social: visitas, clics, consultas, alcance, guardados y compartidos
- [x] 7.3 Priorizar el siguiente tema usando preguntas de pacientes, relevancia clinica, potencial de busqueda y assets disponibles
- [ ] 7.4 Abrir un cambio OpenSpec por cada mejora estructural y agrupar publicaciones editoriales simples en lotes trazables
- [ ] 7.5 Archivar este cambio cuando la infraestructura, el piloto y el circuito recurrente esten implementados y validados
