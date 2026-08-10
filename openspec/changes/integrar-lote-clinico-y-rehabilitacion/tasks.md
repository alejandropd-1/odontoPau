## 1. Infraestructura de contenido

- [x] 1.1 Optimizar y copiar retratos profesionales y activos clínicos confirmados a rutas públicas estables
- [x] 1.2 Extender el tipo `Tratamiento` con una lista opcional y validable de profesionales
- [x] 1.3 Exponer el modelo de profesionales dentro de `Tratamiento` en Stackbit/Netlify Create

## 2. Heroes y contenido de tratamientos

- [x] 2.1 Reemplazar el badge condicional por el render de profesionales declarados en JSON
- [x] 2.2 Adaptar estilos BEM para uno o dos profesionales, foco de imagen, mobile y preferencias de movimiento reducido
- [x] 2.3 Asociar los retratos confirmados a Endodoncia, Estética, Rehabilitación, Pediatría, Ortodoncia y Ortopedia
- [x] 2.4 Retirar estadísticas hardcodeadas, promesas y textos generales no respaldados del detalle de tratamiento
- [x] 2.5 Sustituir el caso pediátrico contaminado por su contenido e imagen autorizados
- [x] 2.6 Incorporar a Paula Gualtieri junto a Roberto Domínguez en el hero de Estética Dental
- [x] 2.7 Estabilizar ancho, márgenes y ajuste de texto del badge profesional en mobile y desktop

## 3. Migración a Rehabilitación

- [x] 3.1 Migrar carpeta, archivo, ID, categoría, nombre y contenido seguro de `implantes` a `rehabilitacion`
- [x] 3.2 Incorporar el caso confirmado del sector anterosuperior y retirar casos/testimonios ficticios
- [x] 3.3 Agregar redirecciones permanentes para la página y los casos históricos de implantes
- [x] 3.4 Actualizar metadata, navegación, sitemap, archivos editoriales y referencias internas al nuevo ID

## 4. Lote editorial

- [x] 4.1 Corregir el ID y las imágenes del artículo de resina en pieza 11 con los activos de `estetica_dental/caso-02`
- [x] 4.2 Crear el artículo breve de ortodoncia con redacción neutral y sus dos imágenes confirmadas
- [x] 4.3 Crear el artículo breve de odontopediatría con una imagen anonimizada y sin etiqueta temporal
- [x] 4.4 Crear el artículo de rehabilitación anterosuperior con las cinco imágenes ordenadas y texto confirmado
- [x] 4.5 Mantener los cuatro casos en revisión técnica y verificar que producción no los publique
- [x] 4.6 Reescribir artículos, casos e instrucciones con voz institucional y sin atribuciones internas a Paula
- [x] 4.7 Enlazar cada caso con su artículo canónico cuando esté disponible y conservar la ficha histórica como respaldo

## 5. QA técnico y visual

- [x] 5.1 Ejecutar `openspec validate integrar-lote-clinico-y-rehabilitacion --strict`
- [x] 5.2 Ejecutar `pnpm exec tsc --noEmit`
- [x] 5.3 Ejecutar `pnpm run lint`
- [x] 5.4 Ejecutar `pnpm run build` en contexto de producción y confirmar ausencia de borradores
- [x] 5.5 Ejecutar build de preview y revisar heroes, artículos, listados, metadata social y rutas redirigidas
- [x] 5.6 Verificar desktop, 375 px, teclado, textos alternativos, contraste y `prefers-reduced-motion`
- [x] 5.7 Repetir validación de OpenSpec, tipos, lint, build preview y control visual tras los ajustes solicitados

## 6. Puerta de publicación y mantenimiento

- [x] 6.1 Obtener aprobación clínica y visual de Paula para las imágenes y textos corregidos
- [x] 6.2 Obtener aprobación de Alejandro sobre heroes, Rehabilitación y navegación del lote
- [x] 6.3 Sólo con ambas aprobaciones, actualizar estados y fechas de publicación
- [x] 6.4 Sólo con autorización explícita, hacer commit, push, deploy preview e integración posterior a `main`
- [x] 6.5 Registrar pendientes de `estetica_dental/caso-03` y `Rehabilitacion/caso-01`/`caso-03` para un OpenSpec futuro

## 7. Segundo lote de casos y hero de Ortopedia

- [x] 7.1 Optimizar los activos de `odontologia_pediatrica/caso-02`, `ortodoncia_invisible/caso-02` y `estetica_dental/caso-04` en rutas públicas estables
- [x] 7.2 Crear el artículo breve del segundo caso de Odontopediatría con tres imágenes anonimizadas y copia neutral
- [x] 7.3 Crear el artículo breve del segundo caso de Ortodoncia Invisible con una imagen y sin etiqueta temporal
- [x] 7.4 Crear el artículo breve de Estética Dental caso 04 con tres registros sin secuencia clínica atribuida
- [x] 7.5 Enlazar los tres artículos desde sus tratamientos y conservarlos en `technical_review`
- [x] 7.6 Generar, optimizar e integrar un collage de aparatología como hero de Ortopedia, excluyendo activos ajenos al servicio
- [x] 7.7 Validar OpenSpec, TypeScript, lint y build en contexto de preview
- [x] 7.8 Desplegar un draft de Netlify y verificar online los cuatro resultados en desktop y mobile

## 8. Ajuste de voz y portadas

- [x] 8.1 Reescribir los tres artículos del segundo lote y sus tarjetas con una voz más cercana, sin narración editorial ni descripciones mecánicas
- [x] 8.2 Confirmar que `/tratamientos` reutiliza el `heroImage` vigente de cada servicio y actualizar la copia de presentación
- [x] 8.3 Repetir validación técnica, control visual y deploy draft de Netlify

## 9. Documentación y continuidad

- [x] 9.1 Actualizar README y CHANGELOG con la arquitectura editorial, el lote clínico, los gates y la operación vigente
- [x] 9.2 Crear un handoff autosuficiente con estado, responsabilidades, rutinas, Netlify, problemas conocidos y punto de reanudación
- [x] 9.3 Validar documentación, OpenSpec y estado final sin realizar commit, push ni deploy de producción
