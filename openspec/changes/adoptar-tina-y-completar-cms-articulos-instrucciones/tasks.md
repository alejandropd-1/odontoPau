## 1. Base, alcance y seguridad de rama

- [ ] 1.1 Registrar rama `change/adoptar-tina-y-completar-cms-articulos-instrucciones`, SHA base de `main`, estado del árbol y versiones de Node, pnpm, OpenSpec, Next, Tina y adaptadores CMS sin incluir `.codegraph/daemon.pid` ni cambios ajenos.
- [ ] 1.2 Inventariar la configuración Stackbit vigente, la evidencia archivada, las 188 rutas neutrales y las rutas exactas de Slice B que Tina debe cubrir; declarar explícitamente tratamientos/casos y portada/institucionales fuera de escritura.
- [ ] 1.3 Documentar proyecto TinaCloud independiente, roles, variables sin valores, rama editorial no productiva y guardas que impiden resolver `main`; detenerse si la cuenta, permisos o rama real difieren del diseño aprobado.

## 2. Infraestructura Tina reproducible

- [ ] 2.1 Incorporar versiones compatibles y fijadas de TinaCMS y su CLI, actualizar selectivamente `package.json` y lockfile, y agregar scripts reproducibles de desarrollo, schema, validación y build.
- [ ] 2.2 Crear `tina/config.ts`, artefactos versionables necesarios y `/admin` para Next.js, distinguiendo modo local, Deploy Preview y TinaCloud sin exponer tokens de build al navegador.
- [ ] 2.3 Implementar la resolución de rama y una aserción automática que bloquee toda escritura remota cuando el destino sea `main`, conservando GitCron/GitHub como responsables de PR y merge.
- [ ] 2.4 Configurar media Git-backed para imágenes autorizadas y campos validados para descargas/videos; registrar mediante una prueba real si MP4 se carga o requiere ingreso controlado por referencia.

## 3. Adaptador, paridad y round-trip

- [ ] 3.1 Implementar un adaptador Tina importable y normalizable para todos los modelos, objetos, listas y uniones discriminadas de Artículos e Instrucciones sin acoplar el manifest neutral al proveedor.
- [ ] 3.2 Alinear obligatoriedad, constantes ocultas/derivadas, selectores, relaciones, fechas, alt y defaults `draft`, preservando ausencia real de campos opcionales y bloqueando estados o combinaciones inválidas.
- [ ] 3.3 Extender fixtures mínimos, parciales y completos y ejecutar round-trip de copias de documentos reales, demostrando conservación de valores, orden, discriminantes y las rutas de Slice B sin mutar `src/data`.
- [ ] 3.4 Integrar la paridad Tina, el comparador estructural, el round-trip y la no mutación en el gate local/remoto determinista y sin credenciales, manteniendo la fotografía Stackbit como evidencia histórica separada.

## 4. Experiencia editorial de Artículos e Instrucciones

- [ ] 4.1 Construir la colección de Artículos con metadata, relaciones, imágenes, fuentes, descargas y todos los módulos renderizados, usando labels/ayudas en español y títulos reconocibles para listas anidadas.
- [ ] 4.2 Construir la colección de Instrucciones con pasos, matrices, avisos, texto, recursos, galerías, imágenes sociales y referencias de video/descarga, ocultando discriminantes técnicos.
- [ ] 4.3 Habilitar altas seguras con slug único y estado `draft`; verificar que ampliar un documento existente conserva ID, slug, URL, canonical, contenido previo y plantilla pública.
- [ ] 4.4 Implementar una navegación editorial compacta —pantalla custom solo si mejora el flujo— con accesos a Artículos e Instrucciones, estados visibles y sin controles de diseño, merge o publicación directa.

## 5. QA, preview y operación

- [ ] 5.1 Ejecutar paridad/equivalencia, validación de contratos, no mutación, `pnpm exec tsc --noEmit --incremental false`, `pnpm run lint`, `pnpm run build`, `git diff --check` y `openspec validate --all --strict`, registrando resultados y limitaciones atribuibles.
- [ ] 5.2 Probar localmente creación y edición de un Artículo y una Instrucción sintéticos mínimos/completos, imágenes, opcionales, errores de validación y recuperación por Git sin incorporar fixtures al contenido público.
- [ ] 5.3 Publicar la rama en Draft PR, verificar CI y Deploy Preview, autenticar Tina con la configuración autorizada y demostrar con evidencia que el guardado modifica únicamente la rama exacta y nunca `main`.
- [ ] 5.4 Auditar preview desktop/mobile desde 320 px, teclado, foco, alt, SEO/noindex, ausencia de desborde y exclusión de borradores; obtener aprobación de Paula para campos/superficies clínicas e imágenes de prueba aplicables y documentar el circuito operativo Tina → rama → PR → preview → aprobación.

## 6. Validacion final de Alejandro

- [ ] 6.1 Alejandro revisa la experiencia Tina y el Deploy Preview final, confirma la evidencia de rama, paridad, privacidad, aprobación clínica aplicable y ausencia de cambios públicos no deseados, y autoriza el commit de cierre y la preparación posterior del OpenSpec Archive. Esta tarea es exclusivamente manual y ningún agente puede marcarla.
