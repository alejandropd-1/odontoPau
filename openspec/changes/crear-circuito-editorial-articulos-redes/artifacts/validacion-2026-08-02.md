# Validacion tecnica y visual - 2026-08-02

## Contenido y privacidad

- Piloto: Endodoncia/caso-01.
- Estado: `draft`.
- Autorizacion de uso: confirmada.
- Las dos radiografias se copiaron como WebP con nombres semanticos y sin metadatos heredados.
- El borrador no incluye pieza dentaria, sintomas, tiempos, materiales, ausencia de dolor, pronostico ni testimonio no confirmados.
- Las explicaciones generales se contrastaron con la American Association of Endodontists y la guia clinica S3 de la European Society of Endodontology.

## Validaciones ejecutadas

- `pnpm exec tsc --noEmit`: correcto.
- `pnpm run lint`: correcto, 0 errores. Permanece 1 warning preexistente en `CustomScrollIndicator.tsx` por atributos ARIA del rol scrollbar; no fue introducido por este cambio.
- `pnpm run build` en contexto de produccion: correcto; genero 24 paginas y no genero el slug del borrador.
- `pnpm run build` con `CONTEXT=deploy-preview`: correcto; genero 25 paginas e incluyo la ruta directa del piloto.
- OpenSpec `validate --strict`: correcto despues de actualizar tareas (27 de 37 completadas; las restantes corresponden a aprobacion, publicacion y cierre).
- Seccion de testimonios y enlace de navegacion: ausentes del HTML de produccion generado, con componente, estilos, datos y editor visual conservados.

## Puertas editoriales verificadas

- En preview, la ruta directa del borrador responde correctamente y declara `noindex`.
- El borrador no aparece en `/articulos`.
- El borrador no aparece en `/sitemap.xml`.
- El canonical apunta a la futura URL de produccion.
- OpenGraph y Twitter usan titulo, resumen e imagen del articulo.
- JSON-LD de Article solo se renderiza cuando el estado sea `published`.

## Revision visual

- Desktop: 1440 x 1000.
- Mobile: 390 x 844.
- FAQ desplegable y menu de compartir: funcionales.
- Consola del navegador: 0 errores y 0 warnings.
- Lighthouse Accessibility inicial: 96 por contraste del boton de WhatsApp.
- Correccion aplicada: fondo verde oscuro para superar contraste AA.
- Lighthouse Accessibility final: 100.
- Lighthouse SEO del borrador: 69 por `noindex`, comportamiento intencional que debe repetirse con el articulo publicado.

## Evidencia local no versionada

Los screenshots, snapshots y reportes Lighthouse se conservaron localmente en `output/playwright/articles-preview/` y no forman parte del contenido publico ni del checkpoint Git.

## Pendiente antes de publicar

- Paula debe revisar el borrador del articulo y el paquete social.
- El responsable del sitio debe aprobar el preview.
- Solo entonces el articulo puede avanzar a `clinical_review`, `technical_review`, `approved` y finalmente `published`.
- La revision final se hara en un Deploy Preview de Netlify antes de autorizar el merge a `main`.
