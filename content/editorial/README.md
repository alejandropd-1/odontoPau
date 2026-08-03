# Circuito editorial recurrente

## Entrada

1. Paula envia imagenes y un texto breve por WhatsApp.
2. El responsable del sitio guarda los originales en una carpeta por tratamiento y caso.
3. Codex completa la plantilla de ingreso, inventaria archivos y enumera solo los datos faltantes.
4. Ninguna imagen entra al repositorio sin autorizacion confirmada.

## Preparacion

1. Abrir o continuar un OpenSpec editorial y trabajar en su rama `codex/`.
2. Copiar las imagenes aprobadas con nombres semanticos, sin metadatos innecesarios y sin modificar los originales.
3. Crear el articulo como `draft`.
4. Redactar solo con los datos aportados por Paula y fuentes generales confiables.
5. Derivar el paquete para Instagram/Facebook desde ese mismo borrador.

## Aprobaciones

1. Paula revisa diagnostico o contexto, tecnica, tiempos, resultados, cifras, recomendaciones, testimonios e imagenes.
2. Codex registra las correcciones y mueve el articulo a `clinical_review` y luego `technical_review`.
3. Se ejecutan TypeScript, lint, build, metadata, sitemap y revision visual desktop/mobile.
4. El responsable del sitio revisa el Deploy Preview de Netlify.

## Publicacion

1. Con todas las aprobaciones, el articulo pasa a `published` dentro de la rama.
2. El responsable autoriza el merge a `main`.
3. Netlify despliega `main` a produccion.
4. Se verifican URL, articulo, tratamiento relacionado, sitemap y WhatsApp.
5. Recién entonces el paquete social se considera programable.

## Seguimiento

Durante la primera semana de cada mes se completa la revision de mantenimiento y la planilla de metricas. Los aprendizajes actualizan la cola editorial; no reescriben contenido clinico sin una nueva aprobacion de Paula.
