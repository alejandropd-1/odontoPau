## 1. Línea base y selección segura

- [x] 1.1 Registrar rama, commit base, estado limpio, versiones de herramientas y evidencia de que el bootstrap está publicado en `main`.
- [x] 1.2 Confirmar, con autorización antes de cualquier operación externa, que `editorial/tina` deriva de `main`, que su branch deploy está listo y que TinaCloud indexó el schema vigente.
- [x] 1.3 Seleccionar una modificación visible, pequeña y reversible sobre contenido existente; registrar aprobación de Paula si afecta contenido clínico o imágenes y autorización de Alejandro para comenzar los ciclos reales.
- [x] 1.4 Definir la pieza del retiro/republicación y el conjunto exacto de ruta canónica, listados, relaciones, sitemap y metadata que deben cambiar.

## 2. Ciclo real de actualización visible

- [x] 2.1 Guardar la modificación desde Tina, comprobarla en el Preview compartible y confirmar que producción conserva todavía el contenido anterior.
- [x] 2.2 Ejecutar el preflight editorial breve sobre el snapshot y, tras la confirmación humana aplicable, activar `Publicar cambios` desde Tina sin completar el PR ni el deploy manualmente.
- [x] 2.3 Registrar request, PR técnico, checks, merge, commit publicado y deploy mediante evidencia mínima; consultar logs completos sólo si aparece un fallo o resultado inesperado.
- [x] 2.4 Verificar la modificación en producción y demostrar que panel, `main`, `editorial/tina`, TinaCloud y Netlify terminaron convergentes.

## 3. Ciclo real de retiro

- [x] 3.1 Cambiar la pieza elegida a `retired`, guardar desde Tina y comprobar en Preview que el documento sigue presente y editable mientras producción no cambia.
- [ ] 3.2 Ejecutar el preflight y, con autorización aplicable, publicar el retiro mediante el mismo request protegido e idempotente.
- [ ] 3.3 Comprobar que la pieza se excluye de ruta canónica, listados, relaciones, sitemap y metadata pública sin borrar su JSON ni duplicar documentos.
- [ ] 3.4 Registrar evidencia mínima y confirmar convergencia completa antes de iniciar la republicación.

## 4. Ciclo real de republicación

- [ ] 4.1 Volver la pieza a `published`, guardar desde Tina y comprobar su restauración en Preview antes de modificar producción.
- [ ] 4.2 Ejecutar el preflight y publicar la republicación desde Tina mediante un request nuevo y único.
- [ ] 4.3 Verificar que producción recupera la ruta y todas las superficies canónicas con el mismo documento y sin duplicados.
- [ ] 4.4 Registrar evidencia mínima y demostrar la convergencia final de ramas, índice, panel y deploy.

## 5. Excepciones y rutina transferible

- [x] 5.1 Clasificar cualquier defecto hallado como propio del bootstrap o como cambio estructural; corregir aquí sólo defectos bloqueantes dentro del alcance y derivar cualquier ampliación a otro OpenSpec.
- [ ] 5.2 Redactar la guía final para usuarios no técnicos: editar, guardar, revisar Preview, publicar, retirar, republicar y reconocer un resultado saludable.
- [x] 5.3 Crear la matriz de excepciones para gates fallidos, divergencia, índice pendiente, error de deploy, duda clínica y cambio estructural, indicando cuándo detenerse y pedir soporte.
- [ ] 5.4 Consolidar tiempos y evidencia no sensible de los tres ciclos y actualizar el handoff reusable para OdontoPia sin copiar modelos, rutas ni allowlists específicos.

## 6. Validación y gate humano

- [ ] 6.1 Ejecutar `openspec validate validar-operacion-editorial-tina-en-produccion --strict`, `git diff --check` y las pruebas específicas de request, allowlist, retiro y convergencia.
- [x] 6.2 Ejecutar los validadores Tina y CMS aplicables, preservando el fixture histórico de 188 rutas y confirmando que las pruebas no modifican `src/data`.
- [x] 6.3 Ejecutar `pnpm exec tsc --noEmit`, `pnpm run lint` y `pnpm run build` una sola vez localmente antes del Draft PR; después confiar en CI sobre el mismo commit salvo fallo o diferencia de entorno.
- [ ] 6.4 Revisar en desktop y mobile que el panel, sus estados y controles funcionen con teclado, etiquetas comprensibles y mensajes que no dependan sólo del color.
- [ ] 6.5 Confirmar que contenido, imágenes, evidencia y reportes no exponen datos sensibles y que Paula aprobó cualquier cambio clínico o imagen aplicable.
- [ ] 6.6 Publicar la rama en un Draft PR autorizado, verificar CI y Deploy Preview sobre la revisión exacta y dejar preparada la evidencia final sin mezclar a `main`.
- [ ] 6.7 Alejandro revisa los tres ciclos reales, la rutina y la evidencia, marca este checkbox y autoriza el commit de cierre y OpenSpec Archive. Esta tarea es exclusivamente manual y ningún agente puede marcarla.
