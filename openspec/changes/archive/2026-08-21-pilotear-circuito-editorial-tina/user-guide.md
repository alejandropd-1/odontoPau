# Guía breve para editar y publicar

Esta rutina es igual para Paula y para cualquier colaborador autorizado del proyecto Tina. No existe un rol editorial adicional dentro del sitio.

## Editar y revisar

1. Ingresá a `/admin/` con tu cuenta de Tina.
2. Abrí Inicio, Servicios, un tratamiento, un artículo o una instrucción.
3. Hacé el cambio y presioná `Save`.
4. Volvé a `Panel editorial` desde el menú de Tina.
5. Abrí `Preview` y revisá la tanda completa. Guardar nunca cambia el sitio público.

Podés repetir edición, `Save` y revisión todas las veces necesarias. Cada guarda actualiza la rama editorial y su Preview.

## Publicar la tanda

1. Confirmá que todos los documentos abiertos fueron guardados.
2. En `Panel editorial`, marcá la confirmación de revisión y aprobaciones clínicas o de imágenes aplicables.
3. Presioná `Publicar cambios` y aceptá el aviso.
4. Esperá el resultado en el mismo panel. No vuelvas a presionar mientras figure una publicación pendiente.

El botón publica el snapshot completo de Preview, no solamente la página que acabás de editar. Los borradores y contenidos retirados continúan sin renderizarse en producción.

## Retirar y volver a publicar contenido

- Para sacar un artículo o una instrucción del sitio sin borrarlo, cambiá `Estado editorial` a `Retirado`, guardá, revisá Preview y publicá la tanda.
- Para restaurarlo, elegí `Publicado`, completá los datos clínicos exigidos, guardá, revisá Preview y publicá nuevamente.

El documento retirado permanece dentro de Tina y puede volver a editarse.

## Si algo se detiene

- `Publicación solicitada`: la automatización todavía está trabajando; esperá.
- `La publicación se detuvo`: producción no cambió. Conservá los cambios en Preview y avisá a la persona responsable del sitio.
- `El enlace de Preview todavía no está configurado`: podés seguir guardando, pero no publiques hasta que el administrador confirme la URL.
- Si el panel informa cambios estructurales, no intentes resolverlos desde Tina: requieren el circuito técnico de OpenSpec.
