# Checklist editorial y de publicacion

## 1. Fuente y asociacion

- [ ] El tratamiento y el profesional coinciden con la informacion de Paula.
- [ ] Cada imagen esta asociada a su caso y orden correctos.
- [ ] Las etiquetas `Antes`/`Despues` solo aparecen cuando corresponden.
- [ ] Las imagenes unicas no reciben una etiqueta inventada.
- [ ] No se dedujo diagnostico, tecnica ni resultado solo desde la imagen.

## 2. Revision clinica

- [ ] Paula confirmo diagnostico o contexto, tecnica, sesiones/tiempos y resultado mencionados.
- [ ] Paula confirmo cifras, materiales, comparaciones y recomendaciones.
- [ ] No hay testimonios creados, parafraseados como cita ni atribuidos sin autorizacion.
- [ ] No hay promesas absolutas como `sin dolor`, `garantizado`, `100%`, `para siempre` o resultados universales.
- [ ] El texto aclara cuando el resultado depende de cada caso.

## 3. Privacidad

- [ ] La autorizacion cubre cada canal previsto.
- [ ] La evidencia privada del consentimiento permanece fuera del repositorio.
- [ ] Se minimizaron rostros, nombres, fondos e identificadores innecesarios.
- [ ] Si aparece un menor, se aplico la decision visual aprobada y se confirmo autorizacion especifica.
- [ ] Se eliminaron metadatos innecesarios y los archivos se renombraron antes de versionarlos.

## 4. Redaccion, accesibilidad y SEO

- [ ] El titulo y la introduccion responden a una pregunta o necesidad real del paciente.
- [ ] El lenguaje es claro, profesional y calido, sin diagnosticar al lector.
- [ ] Cada imagen tiene un texto alternativo util y no identificatorio.
- [ ] Titulo, descripcion, slug, canonical, OpenGraph y datos estructurados son coherentes.
- [ ] Los enlaces al tratamiento y a WhatsApp funcionan y el CTA no promete resultados.

## 5. Validacion tecnica y visual

- [ ] El articulo comienza en `draft` y no aparece en listado, sitemap ni rutas publicas.
- [ ] JSON, slug, `serviceIds` y archivos de imagen pasan la validacion.
- [ ] TypeScript, lint y build finalizan correctamente.
- [ ] La vista fue revisada en desktop y mobile, incluida la comparacion de imagenes.
- [ ] Se verificaron preview social, 404, navegacion por teclado y contraste basico.

## 6. Aprobacion y salida

- [ ] Paula aprobo texto clinico e imagenes finales.
- [ ] El responsable del sitio aprobo el preview.
- [ ] OpenSpec y Git registran el cambio sin datos sensibles.
- [ ] El estado cambia a `published` solo dentro del checkpoint autorizado.
- [ ] El merge a `main` fue autorizado expresamente, porque dispara el deploy de produccion en Netlify.
- [ ] Despues del deploy de `main` se verifican URL, sitemap, enlaces internos y CTA.
- [ ] Los derivados sociales se regeneraron desde la version aprobada del articulo.
