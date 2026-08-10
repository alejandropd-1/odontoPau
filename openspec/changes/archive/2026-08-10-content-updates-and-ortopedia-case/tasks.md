## 1. Actualización de Equipo e Inicio

- [x] 1.1 Actualizar matrículas de los 4 profesionales en `src/components/AboutUs.tsx` (realizado en `Team.tsx`).
- [x] 1.2 Actualizar el subtítulo de especialidad de Paula Gualtieri en el mismo componente.

## 2. Textos de Tratamientos (JSON)

- [x] 2.1 Actualizar descripción en `src/data/tratamientos/rehabilitacion/rehabilitacion.json` (Realizado en TreatmentDetailContent.tsx).
- [x] 2.2 Actualizar descripción general en `src/data/tratamientos/ortodoncia/ortodoncia-invisible.json`.
- [x] 2.3 Reordenar profesionales en `src/data/tratamientos/estetica/estetica-dental.json` (Paula primero).

## 3. Procesamiento y Generación de Imágenes

- [x] 3.1 Generar y reemplazar Hero Image para Estética Dental (Fondo consultorio).
- [x] 3.2 Generar y reemplazar Hero Image para Odontología Pediátrica (Niña con anteojos).
- [x] 3.3 Recortar "Foto 3" del caso "Un abordaje personalizado" (Estética Dental) para ocultar identidad superior.
- [x] 3.4 Copiar y optimizar las 4 fotos del nuevo caso desde `G:\...` hacia `public/images/casos/ortopedia/caso-01/`.

## 4. Actualización de Artículos y Contenido

- [x] 4.1 Modificar caso Rehabilitación ("Renovación estética del sector anterior"): título, epígrafes y texto de "muñones" en `articulos.ts`.
- [x] 4.2 Modificar casos Ortodoncia Invisible: textos de "Inicio" y "Avance y evolución" en `articulos.ts`.
- [x] 4.3 Modificar casos Estética Dental (eliminar epígrafes, cambiar título "adnterior", modificar epígrafes en "Un abordaje personalizado") en `articulos.ts`.
- [x] 4.4 Modificar caso Endodoncia ("Tratamiento de conducto"): reemplazar texto bajo "Salvar la pieza propia" y eliminar secciones FAQ/Fuentes en `articulos.ts`.
- [x] 4.5 Agregar nuevo caso "ortopedia-caso-01" en `articulos.ts` y json.do la información de `texto.txt`.
- [x] 4.6 Sincronizar el título de cada caso clínico vinculado con el título canónico del artículo indicado por `articleSlug`.

## 5. Instrucciones y Descargas

- [x] 5.1 Modificar textos en `instrucciones.ts` para cambiar "Material revisado..." por "Material para descargar luego de los procedimientos." y título de extracción.
- [x] 5.2 Implementar en la instrucción KeepSmiling una galería responsiva con las nueve láminas ordenadas, apertura completa y descarga individual.
- [x] 5.3 Reubicar la galería KeepSmiling junto al bloque de hábitos, reducirla a las portadas 01 y 05–09 y asociar los videos solicitados a sus descargas.
- [x] 5.4 Renumerar visualmente las seis tarjetas como 01–06 y dejar descargas solo en la primera y la última, sin botones en 02–05.
- [x] 5.5 Reemplazar los botones de 01 y 06 por un indicador de play centrado y un control de descarga por ícono arriba a la derecha, manteniendo cuerpos de card uniformes.

## 6. QA y Verificación

- [x] 6.1 Revisión visual de todas las maquetas afectadas.
- [x] 6.2 Build.
- [x] 6.3 Validar la galería KeepSmiling y los títulos sincronizados con OpenSpec, tipos, lint focalizado, build y revisión visual desktop/mobile.
- [x] 6.4 Resolver el error global de lint heredado en `EditorialDashboard.tsx` antes de considerar cerrada la change completa.
- [x] 6.5 Validar en desktop/mobile la nueva composición y comprobar la descarga real de ambos MP4.
- [x] 6.6 Validar la secuencia 01–06, las dos acciones permitidas, ambas descargas y la ausencia de overflow en desktop/mobile.
- [x] 6.7 Validar accesibilidad, reproducción, descargas, igualdad de alturas y ausencia de overflow de los nuevos overlays en desktop/mobile.
