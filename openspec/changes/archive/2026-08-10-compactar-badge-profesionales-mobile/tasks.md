## 1. Contrato editorial

- [x] 1.1 Extender `TratamientoProfessional` y `loadTreatment` en `src/data/tratamientos.ts` con `mobileRole` opcional, aceptando solo texto no vacio cuando este presente.
- [x] 1.2 Exponer `mobileRole` como campo opcional y descriptivo del modelo `TreatmentProfessional` en `stackbit.config.ts`.
- [x] 1.3 Definir roles mobile fieles para Roberto Dominguez en Estetica Dental y Rehabilitacion y para Maria Emilia Omastott en Pediatria, manteniendo intactos sus roles completos.

## 2. Presentacion compartida

- [x] 2.1 Renderizar en `TreatmentDetailContent.tsx` las variantes mobile y desktop del rol, usando `mobileRole ?? role` sin duplicar elementos de la lista ni inferir credenciales.
- [x] 2.2 Compactar en `src/styles/components/_treatment-detail.scss` inset, padding, gaps, avatares, tipografia e interlineado mobile y aplicar un glassmorphism legible compartido, conservando desde `md` la composicion desktop aprobada.
- [x] 2.3 Comprobar que los heroes con cero, uno y dos profesionales mantienen semantica, wrapping y ausencia de overflow horizontal.

## 3. Pruebas y validacion tecnica

- [x] 3.1 Agregar o actualizar pruebas focalizadas para el fallback de `mobileRole`, la variante explicita y el rechazo de valores vacios.
- [x] 3.2 Ejecutar `openspec validate compactar-badge-profesionales-mobile --strict` y dejar el change valido.
- [x] 3.3 Ejecutar `pnpm exec tsc --noEmit` y dejar TypeScript en cero.
- [x] 3.4 Ejecutar `pnpm run lint` y dejar limpio el alcance modificado.
- [x] 3.5 Ejecutar `pnpm run build` y confirmar que las rutas de tratamientos se generan correctamente.

## 4. QA y publicacion controlada

- [x] 4.1 Verificar los heroes de Estetica Dental, Rehabilitacion, Pediatria, Endodoncia, Ortodoncia Invisible y Ortopedia en 320, 375, 390, 430 px y desktop, registrando que el badge no tapa desproporcionadamente el sujeto ni genera overflow.
- [x] 4.2 Generar un Deploy Preview de Netlify desde esta rama sin publicar en produccion y compartir la URL para revision.
- [x] 4.3 Alejandro valida visualmente todos los heroes en mobile y desktop sobre el Deploy Preview y autoriza el commit de cierre; esta tarea es exclusivamente manual y ningun agente puede marcarla.
