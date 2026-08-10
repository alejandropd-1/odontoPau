## 1. Definiciones y primer lote

- [ ] 1.1 Confirmar artículos publicados que integrarán el primer lote social
- [ ] 1.2 Confirmar responsables, fechas, cadencia y mecanismo manual de entrega o programación
- [ ] 1.3 Verificar autorización de uso y privacidad de cada activo seleccionado sin guardar evidencia sensible
- [ ] 1.4 Definir objetivos, audiencias y CTA medible para Instagram y Facebook

## 2. Infraestructura editorial

- [ ] 2.1 Definir una ruta versionada para paquetes sociales fuera de `src/data` y del build público
- [ ] 2.2 Crear el manifiesto de paquete con fuente, canal, formato, copy, activos, UTM, estado, aprobaciones y calendario
- [ ] 2.3 Crear plantillas para post simple, carrusel, Stories y Reel
- [ ] 2.4 Definir estados de borrador, revisión clínica, revisión editorial, aprobado y entregado
- [ ] 2.5 Implementar el control que devuelve a revisión los derivados cuando cambia el artículo fuente

## 3. Producción del paquete

- [ ] 3.1 Preparar los copys del primer lote usando únicamente información presente en los artículos publicados
- [ ] 3.2 Seleccionar el formato de cada pieza según los activos autorizados disponibles
- [ ] 3.3 Preparar estructura slide por slide, captions, CTA y hashtags adaptados por canal
- [ ] 3.4 Preparar textos alternativos, descripciones visuales y subtítulos cuando correspondan
- [ ] 3.5 Generar enlaces canónicos con parámetros UTM consistentes y verificables
- [ ] 3.6 Componer previews para revisión sin acceder ni publicar en cuentas externas

## 4. Revisión y aprobación

- [ ] 4.1 Revisar privacidad, consentimiento, asociación de imágenes y ausencia de datos identificatorios
- [ ] 4.2 Obtener aprobación clínica y visual de Paula para cada pieza
- [ ] 4.3 Obtener aprobación editorial de Alejandro sobre copy, formato, CTA y calendario
- [ ] 4.4 Corregir piezas rechazadas y conservar trazabilidad de versiones y decisiones
- [ ] 4.5 Marcar el paquete como entregado sin convertir esa aprobación en permiso automático de publicación

## 5. QA técnico

- [ ] 5.1 Validar manifiestos, rutas de activos, URLs, UTM y ausencia de información sensible
- [ ] 5.2 Verificar legibilidad, contraste, textos alternativos y subtítulos en los previews
- [ ] 5.3 Ejecutar `openspec validate preparar-redes-sociales-editoriales --strict`
- [ ] 5.4 Ejecutar `pnpm exec tsc --noEmit`
- [ ] 5.5 Ejecutar `pnpm run lint`
- [ ] 5.6 Ejecutar `pnpm run build` y confirmar que los paquetes sociales no ingresan al build público

## 6. Entrega y aprendizaje

- [ ] 6.1 Entregar el paquete final con calendario y enlaces medibles sin publicar en cuentas externas
- [ ] 6.2 Registrar por separado cualquier autorización posterior de programación o publicación
- [ ] 6.3 Registrar métricas disponibles por pieza sin completar datos faltantes
- [ ] 6.4 Revisar resultados y priorizar el siguiente lote con aprendizajes documentados

## 7. Cierre por OpenSpec

- [ ] 7.1 Preparar commit y push selectivos en `change/preparar-redes-sociales-editoriales`, abrir un Draft PR y verificar el diff y los previews finales sin publicar en cuentas externas, hacer merge ni archivar.
- [ ] 7.2 Alejandro revisa el paquete, las aprobaciones de Paula, el calendario y la evidencia final, y autoriza el commit de cierre y el OpenSpec Archive. Esta tarea es exclusivamente manual y ningún agente puede marcarla; tampoco autoriza por sí sola la publicación en redes.
