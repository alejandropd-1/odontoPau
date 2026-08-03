## Why

El sitio necesita un circuito repetible y seguro para convertir las imagenes y el conocimiento clinico de Paula en contenido web indexable y piezas para redes. El material generado por AutoClaw aporta borradores utiles, pero no esta listo para publicarse ni respeta por completo la arquitectura, el sistema visual, Stackbit y las puertas de aprobacion clinica del proyecto.

## What Changes

- Incorporar una seccion publica de articulos en espanol, basada en JSON, relacionada con los tratamientos existentes y editable desde Netlify Visual Editor mediante la integracion Git/Stackbit actual.
- Crear listado, detalle, metadata, imagen social, sitemap, enlaces internos y presentacion responsive para los articulos.
- Definir un flujo editorial con estados de borrador, revision clinica, revision de privacidad/consentimiento, preview tecnica y publicacion aprobada.
- Establecer un paquete de ingreso para las imagenes y datos que entregue Paula, sin almacenar consentimientos ni datos sensibles en el repositorio publico.
- Generar desde cada articulo aprobado derivados para Instagram, Facebook y formatos de video corto, conservando una unica fuente editorial.
- Registrar mantenimiento, correcciones, nuevas publicaciones y mejoras futuras como cambios OpenSpec trazables.

### Alcance inicial

- Infraestructura de articulos y su integracion con tratamientos, SEO, Stackbit y el sistema visual existente.
- Un articulo piloto adaptado desde el material entregado, inicialmente no publicado.
- Plantillas y checklist para repetir el proceso con nuevas imagenes.
- Plan de reutilizacion social y control posterior a la publicacion.

### Fuera de alcance

- Publicar automaticamente sin aprobacion expresa de Paula y del responsable del sitio.
- Gestionar o guardar historias clinicas, consentimientos firmados o datos identificatorios de pacientes.
- Programar publicaciones directamente en cuentas sociales durante esta primera etapa.
- Publicar el caso pediatrico actual mientras sus datos clinicos sigan contaminados con contenido de implantes. La autorizacion de uso de la imagen fue confirmada, pero el texto clinico todavia debe reemplazarse y aprobarse.

## Capabilities

### New Capabilities

- `articulos-odontologia`: Modelo, rutas, renderizado, SEO, imagenes, enlaces internos y edicion CMS de articulos relacionados con tratamientos.
- `flujo-editorial-clinico`: Ingreso, trazabilidad, estados y puertas de aprobacion clinica, editorial, privacidad y tecnica antes de publicar.
- `distribucion-social`: Derivacion controlada de cada articulo aprobado en carruseles, posts, Stories y guiones breves para redes.

### Modified Capabilities

No hay especificaciones vigentes que deban modificarse; OpenSpec se inicializa con este cambio.

## Impact

- Codigo: `src/data`, `src/app`, `src/components`, `src/styles`, `src/app/sitemap.ts`, navegacion y paginas de tratamientos.
- Contenido: nuevos JSON e imagenes optimizadas bajo `public/images/articulos`, siempre como borradores hasta su aprobacion.
- CMS: nuevos modelos y entradas de sitemap en `stackbit.config.ts`, preservando Netlify Visual Editor y su fuente de contenido Git.
- Deploy: Netlify toma `main` como rama de produccion; las ramas OpenSpec se revisan en preview y solo llegan al sitio al aprobar y mezclar a `main`.
- Operacion: Paula aporta hechos clinicos e imagenes; Codex prepara articulo, derivados y mantenimiento; Paula valida los hechos; el responsable del sitio aprueba preview y publicacion.
- Riesgos: afirmaciones clinicas no verificadas, identificacion de pacientes, falta de consentimiento, promesas absolutas, imagenes mal asociadas y publicacion accidental.
- Criterio de exito: un articulo piloto aprobado puede recorrerse desde su tratamiento, aparece correctamente en mobile/SEO/preview social, permanece oculto mientras sea borrador y produce un paquete social coherente sin duplicar la fuente de verdad.
