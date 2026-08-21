## 1. Base, alcance y seguridad de rama

- [x] 1.1 Registrar rama `change/adoptar-tina-y-completar-cms-articulos-instrucciones`, SHA base de `main`, estado del árbol y versiones de Node, pnpm, OpenSpec, Next, Tina y adaptadores CMS sin incluir `.codegraph/daemon.pid` ni cambios ajenos.
- [x] 1.2 Inventariar la configuración Stackbit vigente, la evidencia archivada, las 188 rutas neutrales y las rutas exactas de Slice B que Tina debe cubrir; registrar que el alcance inicial dejaba tratamientos/casos y portada/institucionales fuera de escritura y que luego se amplió explícitamente en las tareas 4.5–4.8.
- [x] 1.3 Documentar proyecto TinaCloud independiente, roles, variables sin valores, rama editorial no productiva y guardas que impiden resolver `main`; detenerse si la cuenta, permisos o rama real difieren del diseño aprobado.

## 2. Infraestructura Tina reproducible

- [x] 2.1 Incorporar versiones compatibles y fijadas de TinaCMS y su CLI, actualizar selectivamente `package.json` y lockfile, y agregar scripts reproducibles de desarrollo, schema, validación y build.
- [x] 2.2 Crear `tina/config.ts`, artefactos versionables necesarios y `/admin` para Next.js, distinguiendo modo local, Deploy Preview y TinaCloud sin exponer tokens de build al navegador.
- [x] 2.3 Implementar la resolución de rama y una aserción automática que bloquee toda escritura remota cuando el destino sea `main`, conservando GitCron/GitHub como responsables de PR y merge.
- [x] 2.4 Configurar media Git-backed para imágenes autorizadas y campos validados para descargas/videos; registrar mediante una prueba real si MP4 se carga o requiere ingreso controlado por referencia.

## 3. Adaptador, paridad y round-trip

- [x] 3.1 Implementar un adaptador Tina importable y normalizable para todos los modelos, objetos, listas y uniones discriminadas de Artículos e Instrucciones sin acoplar el manifest neutral al proveedor.
- [x] 3.2 Alinear obligatoriedad, constantes ocultas/derivadas, selectores, relaciones, fechas, alt y defaults `draft`, preservando ausencia real de campos opcionales y bloqueando estados o combinaciones inválidas.
- [x] 3.3 Extender fixtures mínimos, parciales y completos y ejecutar round-trip de copias de documentos reales, demostrando conservación de valores, orden, discriminantes y las rutas de Slice B sin mutar `src/data`.
- [x] 3.4 Integrar la paridad Tina, el comparador estructural, el round-trip y la no mutación en el gate local/remoto determinista y sin credenciales, manteniendo la fotografía Stackbit como evidencia histórica separada.

## 4. Experiencia editorial integral

- [x] 4.1 Construir la colección de Artículos con metadata, relaciones, imágenes, fuentes, descargas y todos los módulos renderizados, usando labels/ayudas en español y títulos reconocibles para listas anidadas.
- [x] 4.2 Construir la colección de Instrucciones con pasos, matrices, avisos, texto, recursos, galerías, imágenes sociales y referencias de video/descarga, ocultando discriminantes técnicos.
- [x] 4.3 Habilitar altas seguras con slug único y estado `draft`; verificar que ampliar un documento existente conserva ID, slug, URL, canonical, contenido previo y plantilla pública.
- [x] 4.4 Implementar una navegación editorial compacta —pantalla custom solo si mejora el flujo— con accesos a Artículos e Instrucciones, estados visibles y sin controles de diseño, merge o publicación directa.
- [x] 4.5 Implementar colecciones Tina de solo edición para Inicio, índice de Tratamientos y Tratamientos existentes —incluidos profesionales y casos clínicos—, migrando a JSON el copy visible que aún estaba hardcodeado sin cambiar diseño, URLs ni contenido aprobado.
- [x] 4.6 Implementar Visual Editing para Inicio, índice de Tratamientos, cada Tratamiento, Artículos e Instrucciones mediante `ui.router`, consultas reactivas versionadas, `useTina` y `tinaField`, reutilizando los renderizadores públicos sin depender de artefactos generados en producción.
- [x] 4.7 Normalizar la forma GraphQL de Tina al contrato JSON público, cubrir campos raíz, imágenes, listas, objetos anidados y módulos discriminados, y mantener borradores/nuevos documentos disponibles solo después del primer guardado en desarrollo o preview no indexable.
- [x] 4.8 Ampliar el panel editorial custom con accesos y conteos de Inicio y Tratamientos, sin mezclarlo con la trazabilidad futura del dashboard `/editorial` basado en Supabase.
- [x] 4.9 Implementar un sistema visual editorial coherente mediante APIs públicas de Tina: campos simples de 56 px con label flotante, foco, ayuda y error accesibles, conservando controles especializados para selectores, fechas, imágenes, listas y objetos.
- [x] 4.10 Agregar ayudas contextuales y títulos comprensibles a campos y objetos complejos, incluida una navegación clara al editar imágenes compuestas y la explicación de qué superficie pública afecta cada dato.
- [x] 4.11 Usar chips nativos para listas breves y mantener controles separados para párrafos, pasos y recomendaciones extensas, demostrando que cada valor persiste como elemento independiente sin pérdida.
- [x] 4.12 Retirar el render público duplicado de casos clínicos, enlazar cada tarjeta directamente al artículo canónico y conservar las URL históricas solo como redirecciones permanentes no indexables.
- [x] 4.13 Ampliar las pruebas del schema, routing, serialización, marcadores visuales y accesibilidad básica para cubrir 4.9–4.12, exigir que todos los casos resuelvan artículos publicados y prohibir enlaces legacy sin mutar contenido público.

## 5. QA, preview y operación

- [x] 5.1 Ejecutar paridad/equivalencia, validación de contratos, no mutación, `pnpm exec tsc --noEmit --incremental false`, `pnpm run lint`, `pnpm run build`, `git diff --check` y `openspec validate --all --strict`, registrando resultados y limitaciones atribuibles después del refinamiento editorial.
- [x] 5.2 Probar localmente creación y edición de un Artículo y una Instrucción sintéticos mínimos/completos, imágenes, opcionales, errores de validación y recuperación por Git sin incorporar fixtures al contenido público.
- [x] 5.3 Verificar localmente Visual Editing en Inicio, índice de Tratamientos, un Tratamiento con tarjeta de caso, un Artículo y una Instrucción reales: navegación desde el admin, vista lado a lado, actualización reactiva, selección de campos raíz y anidados, guardado/reversión y ausencia de requests Tina en las páginas públicas fuera del iframe.
- [x] 5.4 Publicar la rama en Draft PR, verificar CI y Deploy Preview, autenticar Tina con la configuración autorizada y demostrar con evidencia que el guardado modifica únicamente la rama exacta y nunca `main`.
- [x] 5.5 Auditar preview desktop/mobile desde 320 px, teclado, foco, alt, SEO/noindex, ausencia de desborde y exclusión de borradores; obtener aprobación de Paula para campos/superficies clínicas e imágenes de prueba aplicables y documentar el circuito operativo Tina → rama → PR → preview → aprobación.

## 6. Validacion final de Alejandro

- [x] 6.1 Alejandro revisa la experiencia Tina y el Deploy Preview final, confirma la evidencia de rama, paridad, privacidad, aprobación clínica aplicable y ausencia de cambios públicos no deseados, y autoriza el commit de cierre y la preparación posterior del OpenSpec Archive. Esta tarea es exclusivamente manual y ningún agente puede marcarla.
